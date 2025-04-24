"use server";

import { auth, db } from "@/firebase/admin";
import { CollectionReference, DocumentData, Query } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import  {Interview, SignInParams, SignUpParams, User}  from "../.././types/index";
import {  updateProfile } from 'firebase/auth';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.log("");

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
//   try {
//     const querySnapshot = await db
//       .collection("interviews")
//       .where('userId', '==', userId)
//       .orderBy('createdAt', 'desc')
//       .get();

//     if (querySnapshot.empty) {
//       return null;  // Return null if no interviews found
//     }

//     const interviews: Interview[] = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...(doc.data() as Interview),   // Properly cast doc data to Interview type
//     }));

//     return interviews;
//   } catch (error) {
//     console.error("Error fetching interviews:", error);
//     return null;
//   }
// }

export async function clearSessionLogout() {
  try {
    // Clear the session cookie by deleting it
    const cookieStore = await cookies();
    cookieStore.delete("session");

    // Optionally, you can redirect the user to the login page or another page
    // Example (if you're using Next.js, you can do it this way):
    // const router = useRouter();
    // router.push("/login"); 

    return {
      success: true,
      message: "Session cleared and logged out successfully.",
    };
  } catch (error) {
    console.error("Error during session clear logout:", error);
    return {
      success: false,
      message: "Failed to clear session and log out. Please try again.",
    };
  }
}




export async function updateUserProfile({ name }: { name: string }) {
  const auth = getAuth();  // Ensure this is for client-side authentication

  if (!auth.currentUser) {
    throw new Error('No authenticated user found.');
  }

  await updateProfile(auth.currentUser, { displayName: name });
}



export async function updateUserPassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error('No authenticated user found.');
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  // Re-authenticate the user
  await reauthenticateWithCredential(user, credential);

  // Update the password
  await updatePassword(user, newPassword);
}