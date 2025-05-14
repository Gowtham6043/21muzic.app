import React from 'react';
import { Music } from 'lucide-react';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Music className="h-12 w-12 text-indigo-400" />
          <h1 className="text-4xl font-bold text-white">Harmony Connect</h1>
        </div>
        <p className="text-xl text-gray-300">
          Video call and listen to music with friends
        </p>
      </div>
      
      <AuthForm />
      
      <div className="mt-8 text-center text-gray-400 max-w-md">
        <p>
          Harmony Connect lets you video call with friends while listening to the same music in perfect sync.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;