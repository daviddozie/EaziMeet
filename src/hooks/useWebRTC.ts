import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface UseWebRTCProps {
  socket: Socket;
  roomId: string;
  userId: string;
  stream?: MediaStream;
}

export const useWebRTC = ({ socket, roomId, userId, stream }: UseWebRTCProps) => {
  const [peers, setPeers] = useState<Record<string, RTCPeerConnection>>({});
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  useEffect(() => {
    if (!socket || !stream) return;

    const handleUserConnected = async (newUserId: string) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      peerConnections.current[newUserId] = peerConnection;
      setPeers(prev => ({ ...prev, [newUserId]: peerConnection }));

      // Add local tracks to the peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate, roomId, newUserId);
        }
      };

      // Handle remote streams
      peerConnection.ontrack = (event) => {
        setRemoteStreams(prev => ({
          ...prev,
          [newUserId]: event.streams[0],
        }));
      };

      // Create and send offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', offer, roomId, newUserId);
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit, fromUserId: string) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      peerConnections.current[fromUserId] = peerConnection;
      setPeers(prev => ({ ...prev, [fromUserId]: peerConnection }));

      // Add local tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate, roomId, fromUserId);
        }
      };

      // Handle remote streams
      peerConnection.ontrack = (event) => {
        setRemoteStreams(prev => ({
          ...prev,
          [fromUserId]: event.streams[0],
        }));
      };

      // Set remote description and create answer
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', answer, roomId, fromUserId);
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit, fromUserId: string) => {
      const peerConnection = peerConnections.current[fromUserId];
      if (peerConnection) {
        await peerConnection.setRemoteDescription(answer);
      }
    };

    const handleIceCandidate = async (candidate: RTCIceCandidateInit, fromUserId: string) => {
      const peerConnection = peerConnections.current[fromUserId];
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const handleUserDisconnected = (disconnectedUserId: string) => {
      const peerConnection = peerConnections.current[disconnectedUserId];
      if (peerConnection) {
        peerConnection.close();
      }

      const newPeers = { ...peerConnections.current };
      delete newPeers[disconnectedUserId];
      peerConnections.current = newPeers;
      setPeers(newPeers);

      setRemoteStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[disconnectedUserId];
        return newStreams;
      });
    };

    // Set up socket event listeners
    socket.on('user-connected', handleUserConnected);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('user-disconnected', handleUserDisconnected);

    // Join the room
    socket.emit('join-room', roomId, userId);

    return () => {
      // Clean up
      socket.off('user-connected', handleUserConnected);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('user-disconnected', handleUserDisconnected);

      // Close all peer connections
      Object.values(peerConnections.current).forEach(peer => peer.close());
      peerConnections.current = {};
      setPeers({});
      setRemoteStreams({});
    };
  }, [socket, roomId, userId, stream]);

  return {
    peers,
    remoteStreams,
  };
};