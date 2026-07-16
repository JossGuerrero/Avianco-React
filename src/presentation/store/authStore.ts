import { create } from 'zustand';
import type { User } from '../../domain/entities/User';
import type { RegisterData } from '../../domain/ports/AuthRepository';
import { useCaseFactory } from '../../infrastructure/factories/repository.factory';
import { localTokenStorage } from '../../infrastructure/storage/local-token-storage';
import { getErrorMessage } from '../utils/formatters';

interface AuthState {
  user: User | null;
  token: string | null;
  isStaff: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const storedUser = localTokenStorage.getUser();
const storedToken = localTokenStorage.getToken();

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  token: storedToken,
  isStaff: storedUser?.isStaff ?? false,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const session = await useCaseFactory.loginUseCase.execute({ username, password });
      set({
        user: session.user,
        token: session.token,
        isStaff: session.user.isStaff,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error, 'No se pudo iniciar sesión') });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const session = await useCaseFactory.registerUseCase.execute(data);
      set({
        user: session.user,
        token: session.token,
        isStaff: session.user.isStaff,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error, 'No se pudo completar el registro') });
      return false;
    }
  },

  logout: async () => {
    await useCaseFactory.logoutUseCase.execute();
    set({ user: null, token: null, isStaff: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
