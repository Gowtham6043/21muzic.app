import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import YouTube from 'react-youtube';
import useRoomStore from '../store/roomStore';

const MusicPlayer: React.FC = () => {
  const { currentRoom, pauseTrack, skipTrack } = useRoomStore();
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  
  const playerRef = useRef<any>(null);
  
  const { currentTrack, isPlaying } = currentRoom || {};
  
  const onReady = (event: any) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    if (isPlaying) {
      playerRef.current.playVideo();
    }
  };

  const onStateChange = (event: any) => {
    if (event.data === YouTube.PlayerState.ENDED) {
      skipTrack();
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);
  
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
      if (playerRef.current) {
        playerRef.current.pauseVideo();
      }
    } else if (currentTrack && playerRef.current) {
      playerRef.current.playVideo();
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : newVolume);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (playerRef.current) {
      playerRef.current.setVolume(!isMuted ? 0 : volume);
    }
  };
  
  if (!currentTrack) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
        <p>No track selected</p>
        <p className="text-sm mt-2">Search and add songs to the playlist</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden">
        <YouTube
          videoId={currentTrack.youtubeId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: isPlaying ? 1 : 0,
              controls: 0,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
          className="w-full h-full"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="w-16 h-16 rounded-md object-cover"
        />
        
        <div className="flex-1">
          <h3 className="text-white font-medium truncate">{currentTrack.title}</h3>
          <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 text-gray-400 hover:text-white"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 accent-indigo-500"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button
            onClick={skipTrack}
            className="p-2 text-gray-400 hover:text-white"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;