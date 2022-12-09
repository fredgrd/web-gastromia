import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../app/services/gastromiaApi";
import { RootState } from "../../app/store";

interface AuthState {
  user: User | null;
}

const slice = createSlice({
  name: "auth",
  initialState: { user: null, token: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: User }>
    ) => {
      state.user = user;
    },
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
