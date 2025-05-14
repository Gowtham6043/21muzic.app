import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Video, MessageSquare, Users } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import useAuthStore from '../store/authStore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const createRoom = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Music className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-bold">Harmony Connect</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-300">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Connect with friends through music</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Video call with your friends while listening to the same music in perfect sync.
              Share your favorite songs and enjoy them together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <Video className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Video Calling</h3>
              <p className="text-gray-300">
                Connect face-to-face with your friends with high-quality video calls.
                See reactions in real-time as you listen to music together.
              </p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <Music className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Synchronized Music</h3>
              <p className="text-gray-300">
                Listen to the same songs at the exact same time. Create playlists
                and take turns being the DJ for your friends.
              </p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <MessageSquare className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Chat Anytime</h3>
              <p className="text-gray-300">
                Send messages during your session. Share thoughts about the music
                or just chat about your day.
              </p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <Users className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
              <p className="text-gray-300">
                Create a room and invite your friends to join. Share your room link
                and start enjoying music together instantly.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={createRoom}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-full text-xl font-bold transition-all transform hover:scale-105"
            >
              Create a Room
            </button>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Music className="h-6 w-6 text-indigo-400" />
            <span className="font-bold">Harmony Connect</span>
          </div>
          
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Harmony Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;