import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import appReducer from "./store-slices/app-slice";
import authReducer from "./store-slices/auth-slice";
import cartReducer from "./store-slices/cart-slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
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
