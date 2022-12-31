import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "./storeSlices/authSlice";
import cartReducer from "./storeSlices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
