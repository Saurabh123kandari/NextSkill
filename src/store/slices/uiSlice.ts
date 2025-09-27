import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  sidebar: {
    isOpen: boolean;
  };
  modals: {
    [key: string]: boolean;
  };
  loading: {
    [key: string]: boolean;
  };
}

const initialState: UIState = {
  theme: 'light',
  language: 'en',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  sidebar: {
    isOpen: false,
  },
  modals: {},
  loading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateNotifications: (state, action: PayloadAction<Partial<UIState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
    },
  },
});

export const {
  setTheme,
  setLanguage,
  updateNotifications,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  setLoading,
  clearLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
