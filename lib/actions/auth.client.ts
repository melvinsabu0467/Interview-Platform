"use client";

import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

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
    throw new Error("No authenticated user found.");
  }

  // Re-authenticate to confirm current password
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // Perform the password change
  await updatePassword(user, newPassword);
}
