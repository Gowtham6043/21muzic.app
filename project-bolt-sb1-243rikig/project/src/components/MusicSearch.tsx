import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Track } from '../types';
import { searchTracks } from '../services/musicApi';
import useRoomStore from '../store/roomStore';

const MusicSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { addTrack } = useRoomStore();
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const tracks = await searchTracks(query);
      setResults(tracks);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleAddTrack = (track: Track) => {
    addTrack(track);
  };
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for songs..."
            className="pl-10 block w-full py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {results.length > 0 && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {results.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between p-2 bg-gray-700 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <h4 className="text-white font-medium truncate">{track.title}</h4>
                  <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                </div>
              </div>
              <button
                onClick={() => handleAddTrack(track)}
                className="p-2 text-gray-400 hover:text-white"
                title="Add to playlist"
              >
                <Plus size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicSearch;