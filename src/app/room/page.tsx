"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Mic, VideoIcon, ShareIcon, PhoneIcon, VideoOffIcon, MicOff, MessageSquare, UserPlus, Users } from "lucide-react";
import { useMediaStream } from "@/hooks/useMediaStream";
import { useWebRTC } from "@/hooks/useWebRTC";
import io from 'socket.io-client';

interface Participant {
    id: string;
    name: string;
    stream?: MediaStream | null;
    mic: boolean;
    cam: boolean;
}

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
    path: '/api/socket',
});

const RoomContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams?.get("roomId") || "default-room";
    const userId = useRef(Math.random().toString(36).substring(7)).current;

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [screenSharing, setScreenSharing] = useState(false);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    const { stream, error, toggleAudio, toggleVideo } = useMediaStream();
    const videoRef = useRef<HTMLVideoElement>(null);

    const { remoteStreams } = useWebRTC({
        socket,
        roomId,
        userId,
        stream: screenStream || stream || undefined,
    });

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        // Update participants list when remote streams change
        const updatedParticipants: Participant[] = [
            {
                id: userId,
                name: "You",
                stream: screenSharing && screenStream ? screenStream : stream || undefined,
                mic: stream?.getAudioTracks()[0]?.enabled || false,
                cam: screenSharing ? true : (stream?.getVideoTracks()[0]?.enabled || false),
            },
        ];

        Object.entries(remoteStreams).forEach(([remoteUserId, remoteStream]) => {
            updatedParticipants.push({
                id: remoteUserId,
                name: `User ${remoteUserId.slice(0, 4)}`,
                stream: remoteStream,
                mic: remoteStream.getAudioTracks()[0]?.enabled || false,
                cam: remoteStream.getVideoTracks()[0]?.enabled || false,
            });
        });

        setParticipants(updatedParticipants);
    }, [stream, remoteStreams, userId, screenStream, screenSharing]);

    const toggleMic = () => {
        const newState = toggleAudio();
        setMicOn(newState);
    };

    const toggleCam = () => {
        const newState = toggleVideo();
        setCamOn(newState);
    };

    const toggleScreenShare = async () => {
        try {
            if (!screenSharing) {
                const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                });

                // Add screen share ended event listener
                newScreenStream.getVideoTracks()[0].addEventListener('ended', () => {
                    stopScreenSharing();
                });

                setScreenStream(newScreenStream);
                setScreenSharing(true);
            } else {
                stopScreenSharing();
            }
        } catch (err) {
            console.error("Error sharing screen:", err);
        }
    };

    const stopScreenSharing = () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
        }
        setScreenSharing(false);
    };

    const handleLeave = () => {
        if (confirm("Are you sure you want to leave the meeting?")) {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            router.push("/join-meet");
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0f1724] text-white font-display">
            {error && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md">
                    {error.message}
                </div>
            )}
            {/* Main Meeting Area */}
            <main className="flex-1 flex flex-col p-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {participants.map((p) => (
                        <div
                            key={p.id}
                            className="bg-card-dark rounded-xl flex items-center justify-center relative group overflow-hidden"
                        >
                            {p.stream ? (
                                <div className="relative w-full h-full">
                                    <video
                                        ref={(el) => {
                                            if (p.id === userId) {
                                                videoRef.current = el;
                                            } else if (el) {
                                                (el as HTMLVideoElement).srcObject = p.stream as MediaStream;
                                            }
                                        }}
                                        key={p.id}
                                        autoPlay
                                        playsInline
                                        muted={p.id === userId}
                                        className={`w-full h-full ${screenSharing ? 'object-contain' : 'object-cover'} rounded-xl`}
                                    />
                                    {!p.cam && !screenSharing && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                            <Users size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <Users size={48} className="text-gray-400" />
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
                                {p.name} {p.id === userId && "(You)"}
                            </div>
                            <div className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                {p.mic ? <Mic size={18} /> : <MicOff size={18} />}
                                {p.cam ? <VideoIcon size={18} /> : <VideoOffIcon size={18} />}
                            </div>
                        </div>
                    ))}
                </div>
                

                {/* Control Buttons */}
                <div className="bg-[#111827] shadow-2xl rounded-xl p-4 mt-4 flex items-center justify-center gap-4">
                    <button
                        onClick={toggleMic}
                        className={`w-12 h-12 flex justify-center items-center rounded-full transition-colors ${micOn ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                    >
                        {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                    </button>

                    <button
                        onClick={toggleCam}
                        className={`w-12 h-12 flex justify-center items-center rounded-full transition-colors ${camOn ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                    >
                        {camOn ? <VideoIcon size={18} /> : <VideoOffIcon size={18} />}
                    </button>

                    <button
                        onClick={toggleScreenShare}
                        className={`w-12 h-12 flex justify-center items-center rounded-full transition-colors ${screenSharing ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                    >
                        <ShareIcon size={18} />
                    </button>

                    <button
                        onClick={handleLeave}
                        className="w-12 h-12 flex justify-center items-center bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                    >
                        <PhoneIcon size={18} />
                    </button>
                </div>
            </main>

            {/* Sidebar */}
            <aside className="w-80 bg-[#04142c] flex flex-col border-l border-gray-800">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Meeting Details</h2>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="flex border-b border-gray-700">
                        <button className="flex-1 p-4 flex items-center justify-center gap-2 border-b-2 border-orange-500">
                            <Users /> Participants ({participants.length})
                        </button>
                        <button className="flex-1 p-4 flex items-center justify-center gap-2">
                            <MessageSquare /> Chat
                        </button>
                    </div>

                    {/* Participants */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {participants.map((p) => (
                            <div key={p.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-700 flex items-center justify-center aspect-square rounded-full w-10 h-10 relative overflow-hidden">
                                        {p.stream && p.cam ? (
                                            <video
                                                ref={(el) => {
                                                    if (el && p.stream) {
                                                        el.srcObject = p.stream;
                                                    }
                                                }}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Users size={20} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p>{p.name}</p>
                                        {p.id === userId && screenSharing && (
                                            <span className="text-xs text-gray-400">Screen sharing</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`transition-colors ${p.mic ? 'text-green-500' : 'text-red-500'}`}>
                                        {p.mic ? <Mic size={16} /> : <MicOff size={16} />}
                                    </span>
                                    <span className={`transition-colors ${p.cam ? 'text-green-500' : 'text-red-500'}`}>
                                        {p.cam ? <VideoIcon size={16} /> : <VideoOffIcon size={16} />}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add People */}
                    <div className="p-4 border-t border-gray-700">
                        <Button className="bg-orange-500 w-full hover:bg-orange-600 flex items-center justify-center gap-2">
                            <UserPlus /> Add People
                        </Button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default function RoomPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full bg-[#0f1724] text-white font-display items-center justify-center">Loading...</div>}>
      <RoomContent />
    </Suspense>
  );
}
