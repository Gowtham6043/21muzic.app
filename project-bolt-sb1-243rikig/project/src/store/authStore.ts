import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { AuthState, User } from '../types';

// This is a mock implementation. In a real app, you would connect to a backend service.
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user: User = {
        id: uuidv4(),
        name: email.split('@')[0],
        email,
      };
      
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Login failed');
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user: User = {
        id: uuidv4(),
        name,
        email,
      };
      
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Registration failed');
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;