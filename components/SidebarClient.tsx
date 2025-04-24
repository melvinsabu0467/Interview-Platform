"use client"; // This is a client-side component

import { useState } from "react";
import InterviewCard from "./InterviewCard";

export default function SidebarClient({ user, userInterviews, hasPastInterviews }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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
                className={`transition-all duration-300 ease-in-out bg-gray-900 h-screen ${sidebarOpen ? "w-64 p-4" : "w-0 p-0"
                    } overflow-hidden`}
            >
                {/* Horizontal div with the title */}
                <div className="w-full border-b border-gray-700 pb-2 mb-4">
                    <h2 className="text-white text-lg font-bold">Your Interviews</h2>
                </div>

                <div className="text-white">
                    {hasPastInterviews ? (
                        <div className="interviews-section">
                            {userInterviews.map((interview) => (
                                <InterviewCard
                                    key={interview.id}
                                    userId={user?.id}
                                    interviewId={interview.id}
                                    role={interview.role}
                                    type={interview.type}
                                    techstack={interview.techstack}
                                    createdAt={interview.createdAt}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}
