import { NextRequest } from 'next/server';
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const dynamic = 'force-dynamic';

let io: SocketIOServer;

interface CustomGlobal {
    _io?: SocketIOServer;
}

declare const global: CustomGlobal;

export async function GET(_req: NextRequest) {
    if (!global._io) {
        const httpServer: NetServer = new NetServer();
        io = new SocketIOServer(httpServer, {
            path: '/api/socket-io',
            addTrailingSlash: false,
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
            transports: ['websocket', 'polling'],
        });

        io.on('connection', (socket) => {
            console.log('Socket connected:', socket.id);

            socket.on('join-room', (roomId: string, userId: string) => {
                console.log(`User ${userId} joining room ${roomId}`);
                socket.join(roomId);
                socket.to(roomId).emit('user-connected', userId);

                socket.on('disconnect', () => {
                    console.log(`User ${userId} disconnected`);
                    socket.to(roomId).emit('user-disconnected', userId);
                });

                // WebRTC signaling
                socket.on('offer', (offer: RTCSessionDescriptionInit, targetUserId: string) => {
                    console.log(`Relaying offer from ${userId} to ${targetUserId}`);
                    socket.to(roomId).emit('offer', offer, userId);
                });

                socket.on('answer', (answer: RTCSessionDescriptionInit, targetUserId: string) => {
                    console.log(`Relaying answer from ${userId} to ${targetUserId}`);
                    socket.to(roomId).emit('answer', answer, userId);
                });

                socket.on('ice-candidate', (candidate: RTCIceCandidateInit, targetUserId: string) => {
                    console.log(`Relaying ICE candidate from ${userId} to ${targetUserId}`);
                    socket.to(roomId).emit('ice-candidate', candidate, userId);
                });
            });
        });

        global._io = io;
    }

    return new Response('Socket.IO server is running', {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        },
    });
}