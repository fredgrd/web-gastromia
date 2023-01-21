import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AppState {
  toast: { isOpen: boolean; message: string };
  authModal: boolean;
}

const slice = createSlice({
  name: "app",
  initialState: {
    toast: {
      isOpen: false,
      message: "",
    },
    authModal: false,
  } as AppState,
  reducers: {
    setToastState: (
      state,
      {
        payload: { isOpen, message },
      }: PayloadAction<{ isOpen: boolean; message: string }>
    ) => {
      state.toast.isOpen = isOpen;
      state.toast.message = message;
    },
    setAuthModalState: (
      state,
      { payload: { isOpen } }: PayloadAction<{ isOpen: boolean }>
    ) => {
      state.authModal = isOpen;
    },
  },
});

export const { setToastState, setAuthModalState } = slice.actions;

export default slice.reducer;

export const selectToastState = (state: RootState) => state.app.toast;

export const selectAuthModalState = (state: RootState) => state.app.authModal;
