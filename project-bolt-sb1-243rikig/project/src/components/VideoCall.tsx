import React, { useEffect, useRef, useState } from 'react';
import { User, Mic, MicOff, Video, VideoOff, PhoneOff, Settings } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useRoomStore from '../store/roomStore';
import peerService from '../services/peerService';

interface VideoCallProps {
  roomId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId }) => {
  const { user } = useAuthStore();
  const { currentRoom } = useRoomStore();
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [permissionDismissed, setPermissionDismissed] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        // Check if we already have an active stream
        if (localStream?.active) {
          return;
        }

        setMediaError(null);
        setPermissionDismissed(false);
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error: any) {
        console.error('Error accessing media devices:', error);
        
        let errorMessage = 'Failed to access camera/microphone.';
        let isDismissed = false;
        
        if (error.name === 'NotAllowedError') {
          isDismissed = true;
          errorMessage = 'Camera and microphone access was denied. To join the video call, you need to:';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera or microphone found.';
        } else if (error.name === 'NotReadableError' || error.message.includes('Device in use')) {
          errorMessage = 'Camera or microphone is already in use by another application. Please close other applications using these devices and try again.';
        }
        
        setMediaError(errorMessage);
        setPermissionDismissed(isDismissed);
      }
    };
    
    initializeMedia();
    
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      peerService.removeAllPeers();
    };
  }, []);
  
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const openBrowserSettings = () => {
    // This will open browser settings in a new tab
    window.open('chrome://settings/content/camera', '_blank');
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Local video */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          {mediaError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-white mb-4">
                  <Video className="h-12 w-12" />
                </div>
                <p className="text-white text-lg font-medium mb-2">Media Access Error</p>
                <p className="text-gray-300">{mediaError}</p>
                {permissionDismissed && (
                  <div className="mt-4 space-y-2">
                    <ol className="text-gray-300 text-left list-decimal pl-4 space-y-2">
                      <li>Click the camera icon in your browser's address bar</li>
                      <li>Select "Allow" for both camera and microphone</li>
                      <li>Refresh this page</li>
                    </ol>
                    <button
                      onClick={openBrowserSettings}
                      className="mt-4 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Settings size={18} />
                      <span>Open Browser Settings</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
              />
              
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || <User size={32} />}
                    </div>
                    <div className="mt-4 text-white font-medium">
                      {user?.name || 'You'} (You)
                    </div>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white">
                You
              </div>
            </>
          )}
        </div>
        
        {/* Remote video placeholder */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-white">
                <User size={32} />
              </div>
              <div className="mt-4 text-white font-medium">
                Waiting for others to join...
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-900 p-4 flex justify-center space-x-4">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${
            isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
          } ${mediaError ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!!mediaError}
        >
          {isMuted ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
          } ${mediaError ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!!mediaError}
        >
          {isVideoOff ? (
            <VideoOff className="h-6 w-6 text-white" />
          ) : (
            <Video className="h-6 w-6 text-white" />
          )}
        </button>
        
        <button className="p-4 rounded-full bg-red-500 hover:bg-red-600">
          <PhoneOff className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;