import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-room', (roomId: string, userId: string) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
          socket.to(roomId).emit('user-disconnected', userId);
        });
      });

      // Handle WebRTC signaling
      socket.on('offer', (offer, roomId, userId) => {
        socket.to(roomId).emit('offer', offer, userId);
      });

      socket.on('answer', (answer, roomId, userId) => {
        socket.to(roomId).emit('answer', answer, userId);
      });

      socket.on('ice-candidate', (candidate, roomId, userId) => {
        socket.to(roomId).emit('ice-candidate', candidate, userId);
      });
    });
  }
  res.end();
};

export default SocketHandler;