import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  name: string | null;
};

const initialState: UserState = { name: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    clearUser(state) {
      state.name = null;
    },
  },
});

export const { setUserName, clearUser } = userSlice.actions;
export default userSlice.reducer;
