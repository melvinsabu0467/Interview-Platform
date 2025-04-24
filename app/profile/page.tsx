'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, updateUserProfile, updateUserPassword } from '@/lib/actions/auth.action';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState({ name: '', email: '' });
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchUser() {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    setName(currentUser.name);
                } else {
                    router.push('/sign-in');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }

        fetchUser();
    }, [router]);

    const handleNameUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUserProfile({ name });
            setMessage('Name updated successfully.');
        } catch (error) {
            console.error('Error updating name:', error);
            setMessage('Failed to update name.');
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match.');
            return;
        }
        try {
            await updateUserPassword({ currentPassword, newPassword });
            setMessage('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage('Failed to update password.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center">Profile</h2>
            <p className="mb-4 text-center">Email: {user.email}</p>

            <form onSubmit={handleNameUpdate} className="mb-6">
                <label className="block mb-2 font-medium">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Update Name
                </button>
            </form>

            <form onSubmit={handlePasswordUpdate}>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Update Password
                </button>
            </form>

            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
    );
}
