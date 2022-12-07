import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { gastromiaApi } from "./services/gastromia";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [gastromiaApi.reducerPath]: gastromiaApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gastromiaApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
