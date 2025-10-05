import { useState, useEffect } from 'react';

export const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (mounted) {
          setStream(mediaStream);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          console.error('Error accessing media devices:', err);
        }
      }
    };

    initStream();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
        return audioTrack.enabled;
      }
    }
    return false;
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
        return videoTrack.enabled;
      }
    }
    return false;
  };

  return {
    stream,
    error,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
  };
};