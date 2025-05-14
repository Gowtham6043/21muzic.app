export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  participants: User[];
  messages: Message[];
  currentTrack?: Track;
  playlist: Track[];
  isPlaying: boolean;
}

export interface Track {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  previewUrl: string;
  addedBy: string;
  deezerData?: {
    id: number;
    artistId: number;
    albumId: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface RoomState {
  currentRoom: Room | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (content: string) => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  playTrack: (trackId: string) => void;
  pauseTrack: () => void;
  skipTrack: () => void;
}