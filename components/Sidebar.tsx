'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewsByUserId, deleteInterviewById } from '@/lib/actions/general.action';
import { FaTimes } from 'react-icons/fa'; // Importing the red "X" icon

export const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [interviewHistory, setInterviewHistory] = useState([]);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        async function fetchHistory() {
            try {
                const user = await getCurrentUser();
                if (user?.id) {
                    const history = await getInterviewsByUserId(user.id);
                    setInterviewHistory(history);
                }
            } catch (error) {
                console.error('Failed to load interview history:', error);
            }
        }
        fetchHistory();
    }, []);

    const handleDelete = async (interviewId) => {
        try {
            await deleteInterviewById(interviewId);
            setInterviewHistory((prevHistory) =>
                prevHistory.filter((interview) => interview.id !== interviewId)
            );
        } catch (error) {
            console.error('Failed to delete interview:', error);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Hamburger menu */}
            <button
                onClick={toggleSidebar}
                className="p-2 m-4 border rounded-md flex flex-col justify-center bg-white items-center"
            >
                <span className="block w-6 h-0.5 bg-black mb-1"></span>
                <span className="block w-6 h-0.5 bg-black mb-1"></span>
                <span className="block w-6 h-0.5 bg-black"></span>
            </button>

            {/* Sidebar */}
            <div
                className={`transition-all duration-300 ease-in-out bg-gray-900 h-screen text-white flex flex-col ${sidebarOpen ? 'w-64 p-4' : 'w-0 p-0'
                    } overflow-hidden`}
            >
                <h3 className="mb-2 font-bold">Interview History</h3>
                {interviewHistory.length > 0 ? (
                    <div className="flex flex-col space-y-2">
                        {interviewHistory.map((interview) => (
                            <div
                                key={interview.id}
                                className="relative group truncate p-2 rounded-md bg-gray-700 hover:bg-gray-600"
                            >
                                <Link href={`/interview/${interview.id}`}>
                                    {interview.role} •{' '}
                                    {new Date(interview.createdAt).toLocaleDateString()}
                                </Link>
                                <button
                                    onClick={() => handleDelete(interview.id)}
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 w-10 h-10"
                                    aria-label="Delete interview"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm p-2 rounded-md bg-gray-700">
                        No past interviews found.
                    </p>
                )}
            </div>
        </div>
    );
};
