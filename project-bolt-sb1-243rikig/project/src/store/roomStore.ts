import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { RoomState, Room, Message, Track } from '../types';
import useAuthStore from './authStore';

// This is a mock implementation. In a real app, you would connect to a backend service.
const useRoomStore = create<RoomState>((set, get) => ({
  currentRoom: null,
  
  joinRoom: (roomId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    // Mock room data
    const room: Room = {
      id: roomId,
      name: `Music Room ${roomId.substring(0, 4)}`,
      participants: [user],
      messages: [],
      playlist: [],
      isPlaying: false,
    };
    
    set({ currentRoom: room });
  },
  
  leaveRoom: () => {
    set({ currentRoom: null });
  },
  
  sendMessage: (content: string) => {
    const user = useAuthStore.getState().user;
    if (!user || !get().currentRoom) return;
    
    const message: Message = {
      id: uuidv4(),
      senderId: user.id,
      content,
      timestamp: Date.now(),
    };
    
    set((state) => ({
      currentRoom: state.currentRoom ? {
        ...state.currentRoom,
        messages: [...state.currentRoom.messages, message],
      } : null,
    }));
  },
  
  addTrack: (track: Track) => {
    if (!get().currentRoom) return;
    
    set((state) => ({
      currentRoom: state.currentRoom ? {
        ...state.currentRoom,
        playlist: [...state.currentRoom.playlist, track],
      } : null,
    }));
  },
  
  removeTrack: (trackId: string) => {
    if (!get().currentRoom) return;
    
    set((state) => ({
      currentRoom: state.currentRoom ? {
        ...state.currentRoom,
        playlist: state.currentRoom.playlist.filter(track => track.id !== trackId),
      } : null,
    }));
  },
  
  playTrack: (trackId: string) => {
    if (!get().currentRoom) return;
    
    const track = get().currentRoom?.playlist.find(t => t.id === trackId);
    if (!track) return;
    
    set((state) => ({
      currentRoom: state.currentRoom ? {
        ...state.currentRoom,
        currentTrack: track,
        isPlaying: true,
      } : null,
    }));
  },
  
  pauseTrack: () => {
    if (!get().currentRoom) return;
    
    set((state) => ({
      currentRoom: state.currentRoom ? {
        ...state.currentRoom,
        isPlaying: false,
      } : null,
    }));
  },
  
  skipTrack: () => {
    if (!get().currentRoom) return;
    
    const currentTrackId = get().currentRoom?.currentTrack?.id;
    const playlist = get().currentRoom?.playlist || [];
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % playlist.length;
    
    if (playlist.length > 0) {
      set((state) => ({
        currentRoom: state.currentRoom ? {
          ...state.currentRoom,
          currentTrack: playlist[nextIndex],
          isPlaying: true,
        } : null,
      }));
    }
  },
}));

export default useRoomStore;