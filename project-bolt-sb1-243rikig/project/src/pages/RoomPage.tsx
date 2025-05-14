import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, MessageSquare } from 'lucide-react';
import VideoCall from '../components/VideoCall';
import MusicPlayer from '../components/MusicPlayer';
import MusicSearch from '../components/MusicSearch';
import Playlist from '../components/Playlist';
import ChatBox from '../components/ChatBox';
import useRoomStore from '../store/roomStore';

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { joinRoom, leaveRoom, currentRoom } = useRoomStore();
  const [activeTab, setActiveTab] = useState<'music' | 'chat'>('music');
  
  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
    }
    
    return () => {
      leaveRoom();
    };
  }, [roomId]);
  
  const goBack = () => {
    navigate('/');
  };
  
  if (!roomId || !currentRoom) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Loading room...</p>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={goBack}
            className="p-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{currentRoom.name}</h1>
        </div>
        
        <div className="text-sm text-gray-400">
          {currentRoom.participants.length} participant{currentRoom.participants.length !== 1 ? 's' : ''}
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="lg:col-span-2">
          <VideoCall roomId={roomId} />
        </div>
        
        <div className="flex flex-col h-full">
          <div className="bg-gray-800 mb-4 rounded-lg overflow-hidden">
            <div className="flex border-b border-gray-700">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'music'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('music')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Music size={18} />
                  <span>Music</span>
                </div>
              </button>
              
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'chat'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <MessageSquare size={18} />
                  <span>Chat</span>
                </div>
              </button>
            </div>
            
            <div className="p-4">
              <MusicPlayer />
            </div>
          </div>
          
          {activeTab === 'music' ? (
            <div className="flex-1 space-y-4">
              <MusicSearch />
              <Playlist />
            </div>
          ) : (
            <div className="flex-1">
              <ChatBox />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;