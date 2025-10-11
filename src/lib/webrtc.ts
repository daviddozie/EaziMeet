import { Socket } from 'socket.io-client';

export const initializeWebRTC = (socket: Socket, roomId: string) => {
  // Configure STUN servers for WebRTC
  const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  return new Promise((resolve, reject) => {
    try {
      socket.emit('join-room', roomId, (response: { users: string[] } | { error: string }) => {
        if ('error' in response) {
          reject(response.error);
        } else {
          resolve(configuration);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const setupPeerConnection = async (socket: Socket, roomId: string, stream: MediaStream) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
        ],
      },
    ],
  });

  // Add all local tracks to the peer connection
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  // Set up ICE candidate handling
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        candidate: event.candidate,
        roomId,
      });
    }
  };

  // Log state changes
  peerConnection.oniceconnectionstatechange = () => {
    console.log('ICE Connection State:', peerConnection.iceConnectionState);
  };

  peerConnection.onconnectionstatechange = () => {
    console.log('Connection State:', peerConnection.connectionState);
  };

  return peerConnection;
};