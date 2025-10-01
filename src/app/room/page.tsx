"use client";

import React from "react";
import { useRouter } from "next/navigation";

const participants = [
    {
        name: "You",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAUb97p2XWEJM5TQx7a0C17_SL7gNLqd5c9GgrYUhxTJRZ1hBDiU-qZdXbbE4N0Cmjmgb4oL3OwJArYKLR5W2a2v-_tu9jm1YCKm7HJkzepUTyo8mZkAs74ra25DDkdccaVf9gYsq7A8bwOXWAfVQksSddCr3IVhhw1IDExkUtr5AzqoQ2EBLTJM_JRNsTqfjccSNPQFCiWPl48lEQ36iue_HliMv1zO4lIbGdWWMMMYVqcldU5yJs7kLUdaTybP9ijBkGVzEMZigUb",
        mic: true,
        cam: true,
    },
    {
        name: "Alex Doe",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAUb97p2XWEJM5TQx7a0C17_SL7gNLqd5c9GgrYUhxTJRZ1hBDiU-qZdXbbE4N0Cmjmgb4oL3OwJArYKLR5W2a2v-_tu9jm1YCKm7HJkzepUTyo8mZkAs74ra25DDkdccaVf9gYsq7A8bwOXWAfVQksSddCr3IVhhw1IDExkUtr5AzqoQ2EBLTJM_JRNsTqfjccSNPQFCiWPl48lEQ36iue_HliMv1zO4lIbGdWWMMMYVqcldU5yJs7kLUdaTybP9ijBkGVzEMZigUb",
        mic: true,
        cam: false,
    },
    {
        name: "Jane Smith",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAUb97p2XWEJM5TQx7a0C17_SL7gNLqd5c9GgrYUhxTJRZ1hBDiU-qZdXbbE4N0Cmjmgb4oL3OwJArYKLR5W2a2v-_tu9jm1YCKm7HJkzepUTyo8mZkAs74ra25DDkdccaVf9gYsq7A8bwOXWAfVQksSddCr3IVhhw1IDExkUtr5AzqoQ2EBLTJM_JRNsTqfjccSNPQFCiWPl48lEQ36iue_HliMv1zO4lIbGdWWMMMYVqcldU5yJs7kLUdaTybP9ijBkGVzEMZigUb",
        mic: false,
        cam: true,
    },
];

const MeetingPage: React.FC = () => {
    const router = useRouter();
    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-display">
            {/* Main meeting area */}
            <main className="flex-1 flex flex-col p-4 bg-blue-light/20 dark:bg-background-dark">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {participants.map((p) => (
                        <div
                            key={p.name}
                            className="bg-card-dark rounded-xl flex items-center justify-center relative group"
                        >
                            <div
                                className="bg-center bg-no-repeat aspect-video bg-cover rounded-xl w-full h-full"
                                style={{ backgroundImage: `url(${p.image})` }}
                            ></div>
                            <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
                                {p.name}
                            </div>
                            <div className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <span className="material-symbols-outlined">
                                    {p.mic ? "mic" : "mic_off"}
                                </span>
                                <span className="material-symbols-outlined">
                                    {p.cam ? "videocam" : "videocam_off"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="bg-white/10 dark:bg-card-dark/50 backdrop-blur-sm rounded-xl p-4 mt-4 flex items-center justify-center gap-4">
                    <button className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined">mic</span>
                    </button>
                    <button className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined">videocam</span>
                    </button>
                    <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition-colors">
                        <span className="material-symbols-outlined">present_to_all</span>
                    </button>
                    <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                    <button onClick={() => router.push('join-meet')} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors">
                        <span className="material-symbols-outlined">call_end</span>
                    </button>
                </div>
            </main>

            {/* Sidebar */}
            <aside className="w-80 bg-white dark:bg-card-dark flex flex-col border-l border-gray-200/10 dark:border-white/10">
                <div className="p-4 border-b border-gray-200/10 dark:border-white/10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Meeting Details
                    </h2>
                </div>

                <div className="flex-1 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200/10 dark:border-white/10">
                        <button className="flex-1 p-4 text-sm font-medium text-center text-gray-600 dark:text-gray-300 hover:bg-blue-light/20 dark:hover:bg-blue-dark/20 border-b-2 border-primary flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">people</span>
                            Participants ({participants.length})
                        </button>
                        <button className="flex-1 p-4 text-sm font-medium text-center text-gray-600 dark:text-gray-300 hover:bg-blue-light/20 dark:hover:bg-blue-dark/20 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">chat</span>Chat
                        </button>
                    </div>

                    {/* Participants list */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {participants.map((p) => (
                            <div
                                key={p.name}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
                                        style={{ backgroundImage: `url(${p.image})` }}
                                    ></div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {p.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500">
                                        {p.mic ? "mic" : "mic_off"}
                                    </span>
                                    <span className="material-symbols-outlined text-gray-500">
                                        {p.cam ? "videocam" : "videocam_off"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add People */}
                    <div className="p-4 border-t border-gray-200/10 dark:border-white/10">
                        <button className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">person_add</span>
                            Add People
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default MeetingPage;
