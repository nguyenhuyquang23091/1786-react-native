import { create } from 'zustand';
import { CurrentUser, UserCredentials } from '../interface/UserInterface';
import { UserService } from '../services/userService';

interface AuthState {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  signIn: (credentials: UserCredentials) => Promise<void>;
  signUp: (credentials: UserCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

const userService = new UserService();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  signIn: async (credentials: UserCredentials) => {
    try {
      set({ isLoading: true, error: null });
      await userService.signIn(credentials);
      
      // Get user data after successful sign in
      const currentUser = await userService.getCurrentUser();
      set({ 
        user: currentUser, 
        isAuthenticated: !!currentUser,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Sign in failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  signUp: async (credentials: UserCredentials) => {
    try {
      set({ isLoading: true, error: null });
      await userService.signUp(credentials);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Sign up failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      // Add sign out logic here when implementing Firebase signOut
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Sign out failed', 
        isLoading: false 
      });
    }
  },

  getCurrentUser: async () => {
    try {
      set({ isLoading: true });
      const currentUser = await userService.getCurrentUser();
      set({ 
        user: currentUser, 
        isAuthenticated: !!currentUser,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to get current user',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));