import React from 'react';
import { Music, Trash2 } from 'lucide-react';
import useRoomStore from '../store/roomStore';
import useAuthStore from '../store/authStore';

const Playlist: React.FC = () => {
  const { currentRoom, playTrack, removeTrack } = useRoomStore();
  const { user } = useAuthStore();
  
  const playlist = currentRoom?.playlist || [];
  const currentTrackId = currentRoom?.currentTrack?.id;
  
  if (playlist.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
        <Music className="mx-auto h-8 w-8 mb-2" />
        <p>Your playlist is empty</p>
        <p className="text-sm mt-2">Search for songs to add to your playlist</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-medium mb-4">Playlist ({playlist.length})</h3>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {playlist.map((track) => (
          <div
            key={track.id}
            className={`flex items-center justify-between p-2 rounded-md ${
              track.id === currentTrackId
                ? 'bg-indigo-900 border-l-4 border-indigo-500'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <div
              className="flex items-center space-x-3 flex-1 cursor-pointer"
              onClick={() => playTrack(track.id)}
            >
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-medium truncate">{track.title}</h4>
                <p className="text-gray-400 text-sm truncate">{track.artist}</p>
              </div>
            </div>
            
            {track.addedBy === user?.id && (
              <button
                onClick={() => removeTrack(track.id)}
                className="p-2 text-gray-400 hover:text-red-500"
                title="Remove from playlist"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;