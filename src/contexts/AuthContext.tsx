import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication - in real app, this would be an API call
      if (email === 'demo@nextskill.com' && password === 'password') {
        const user: User = {
          id: '1',
          name: 'Demo User',
          email: email,
          avatar: undefined,
        };

        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Login failed' });
      throw error;
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      dispatch({ type: 'AUTH_START' });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock signup - in real app, this would be an API call
      const user: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        avatar: undefined,
      };

      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Signup failed' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};