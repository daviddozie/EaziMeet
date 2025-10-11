import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface UseWebRTCProps {
  socket: Socket;
  roomId: string;
  userId: string;
  stream?: MediaStream;
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  }
];

export const useWebRTC = ({ socket, roomId, userId, stream }: UseWebRTCProps) => {
  const [peers, setPeers] = useState<Record<string, RTCPeerConnection>>({});
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  // Function to create a new peer connection
  const createPeerConnection = (targetUserId: string) => {
    try {
      const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      
      // Add local stream tracks to the connection
      if (stream) {
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });
      }

      // Monitor connection state
      peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state with ${targetUserId}:`, peerConnection.connectionState);
        if (peerConnection.connectionState === 'failed') {
          console.log('Connection failed, attempting to reconnect...');
          // Attempt to recreate the connection
          peerConnection.restartIce();
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate, roomId, targetUserId);
        }
      };

      // Handle incoming streams
      peerConnection.ontrack = (event) => {
        setRemoteStreams(prev => ({
          ...prev,
          [targetUserId]: event.streams[0],
        }));
      };

      peerConnections.current[targetUserId] = peerConnection;
      setPeers(prev => ({ ...prev, [targetUserId]: peerConnection }));

      return peerConnection;
    } catch (err) {
      console.error('Error creating peer connection:', err);
      return null;
    }
  };

  useEffect(() => {
    if (!socket || !stream) return;

    const handleUserConnected = async (newUserId: string) => {
      console.log('New user connected:', newUserId);
      const peerConnection = createPeerConnection(newUserId);
      if (!peerConnection) return;

      try {
        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('Sending offer to:', newUserId);
        socket.emit('offer', offer, roomId, newUserId);
      } catch (err) {
        console.error('Error creating offer:', err);
      }
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit, fromUserId: string) => {
      console.log('Received offer from:', fromUserId);
      let peerConnection = peerConnections.current[fromUserId];
      
      if (!peerConnection) {
        const newPeerConnection = createPeerConnection(fromUserId);
        if (!newPeerConnection) return;
        peerConnection = newPeerConnection;
      }

      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log('Sending answer to:', fromUserId);
        socket.emit('answer', answer, roomId, fromUserId);
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit, fromUserId: string) => {
      console.log('Received answer from:', fromUserId);
      const peerConnection = peerConnections.current[fromUserId];
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          console.log('Successfully set remote description from answer');
        } catch (err) {
          console.error('Error setting remote description from answer:', err);
        }
      }
    };

    const handleIceCandidate = async (candidate: RTCIceCandidateInit, fromUserId: string) => {
      console.log('Received ICE candidate from:', fromUserId);
      const peerConnection = peerConnections.current[fromUserId];
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          console.log('Successfully added ICE candidate');
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    };

    const handleUserDisconnected = (disconnectedUserId: string) => {
      console.log('User disconnected:', disconnectedUserId);
      const peerConnection = peerConnections.current[disconnectedUserId];
      if (peerConnection) {
        peerConnection.close();
      }

      // Clean up peer connections
      const newPeers = { ...peerConnections.current };
      delete newPeers[disconnectedUserId];
      peerConnections.current = newPeers;
      setPeers(newPeers);

      // Clean up remote streams
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
    console.log('Joining room:', roomId, 'with userId:', userId);
    socket.emit('join-room', roomId, userId);

    return () => {
      // Clean up
      console.log('Cleaning up WebRTC connections');
      socket.off('user-connected', handleUserConnected);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('user-disconnected', handleUserDisconnected);

      // Close all peer connections
      Object.values(peerConnections.current).forEach(peer => {
        peer.close();
      });
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