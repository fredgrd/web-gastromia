import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/user";
import { RootState } from "../store";
import { fetchUser, updateUser } from "../services/user-api";

interface AuthState {
  user: User | null | undefined;
  isFetchingUser: boolean;
  isUpdatignUser: boolean;
}

export const fetchRemoteUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, thunkApi) => {
    const user = await fetchUser();
    return user;
  }
);

export const updateRemoteUser = createAsyncThunk(
  "auth/updateUser",
  async (update: { name?: string; email?: string }, thunkApi) => {
    const user = await updateUser({ ...update });
    return user;
  }
);

const slice = createSlice({
  name: "auth",
  initialState: {
    user: undefined,
    isFetchingUser: false,
    isUpdatignUser: false,
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: User | null }>
    ) => {
      state.user = user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRemoteUser.pending, (state, _) => {
      state.isFetchingUser = true;
    });
    builder.addCase(fetchRemoteUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isFetchingUser = false;
    });
    builder.addCase(updateRemoteUser.pending, (state, _) => {
      state.isUpdatignUser = true;
    });
    builder.addCase(updateRemoteUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload;
      }
      state.isUpdatignUser = false;
    });
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
