import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  CartItemSnapshot,
  equate,
  isCartSnapshot,
} from "../../models/cart-snapshot";
import { fetchCartSnapshot, updateCartSnapshot } from "../services/cart-api";

interface CartState {
  items: CartItemSnapshot[];
  excluded: { item: CartItemSnapshot; message: string }[];
  isFetchingSnapshot: boolean;
  isUpdatingSnapshot: boolean;
}

// Fetch the remote cart and update the client's cart
export const fetchRemoteSnapshot = createAsyncThunk(
  "cart/fetchRemoteSnapshot",
  async (_, thunkApi) => {
    const cartSnapshot = await fetchCartSnapshot();
    return cartSnapshot;
  }
);

// Update the remote cart with the client's latest snapshot
export const updateRemoteSnapshot = createAsyncThunk(
  "cart/updateRemoteSnapshot",
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;

    const cartSnapshot = await updateCartSnapshot(state.cart.items);
    return cartSnapshot;
  }
);

const slice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    excluded: [],
    isFetchingSnapshot: false,
    isUpdatingSnapshot: false,
  } as CartState,
  reducers: {
    updateCart: (
      state,
      {
        payload: { included, excluded },
      }: PayloadAction<{
        included: CartItemSnapshot[];
        excluded: { item: CartItemSnapshot; message: string }[];
      }>
    ) => {
      state.items = included;
      state.excluded = excluded;
    },
    updateExcluded: (
      state,
      {
        payload: { excluded },
      }: PayloadAction<{
        excluded: { item: CartItemSnapshot; message: string }[];
      }>
    ) => {
      state.excluded = excluded;
    },
    addOne: (
      state,
      {
        payload: { item, quantity },
      }: PayloadAction<{ item: CartItemSnapshot; quantity: number }>
    ) => {
      const cartItemIdx = state.items.findIndex((cartItem) =>
        equate(cartItem, item)
      );

      if (cartItemIdx !== -1) {
        state.items[cartItemIdx].quantity += quantity;
      } else {
        state.items.push({ ...item, quantity: quantity });
      }
    },
    updateOne: (
      state,
      { payload: { item } }: PayloadAction<{ item: CartItemSnapshot }>
    ) => {
      const cartItemIdx = state.items.findIndex((cartItem) =>
        equate(cartItem, item)
      );

      if (cartItemIdx !== -1) {
        state.items[cartItemIdx] = item;
      } else if (cartItemIdx !== -1 && item.quantity === 0) {
        state.items.splice(cartItemIdx, 1);
      } else {
        state.items.push(item);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRemoteSnapshot.pending, (state, _) => {
      state.isFetchingSnapshot = true;
    });

    builder.addCase(fetchRemoteSnapshot.fulfilled, (state, action) => {
      const snapshot = action.payload;
      if (!snapshot) {
        console.log("FetchRemoteSnapshot error: NoSnapshot");
        state.isFetchingSnapshot = false;
      }

      if (isCartSnapshot(snapshot) && snapshot.update_snapshot) {
        state.items = snapshot.included;
        state.excluded = snapshot.excluded;
        state.isFetchingSnapshot = false;
      }

      state.isFetchingSnapshot = false;
    });

    builder.addCase(updateRemoteSnapshot.pending, (state, _) => {
      state.isUpdatingSnapshot = true;
    });

    builder.addCase(updateRemoteSnapshot.fulfilled, (state, action) => {
      const snapshot = action.payload;
      if (!snapshot) {
        console.log("UpdateRemoteSnapshot error: NoSnapshot");
        state.isUpdatingSnapshot = false;
      }

      if (isCartSnapshot(snapshot) && snapshot.update_snapshot) {
        state.items = snapshot.included;
        state.excluded = snapshot.excluded;
        state.isUpdatingSnapshot = false;
      }

      state.isUpdatingSnapshot = false;
    });
  },
});

export const { updateCart, updateExcluded, updateOne, addOne } = slice.actions;

export default slice.reducer;

export const selectCart = (state: RootState) => state.cart.items;

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((acc, curr) => acc + curr.quantity, 0);

export const selectCartTotal = (state: RootState) => {
  return state.cart.items.reduce((accTot, currItem) => {
    const attributesTot = currItem.attributes_snapshot.reduce(
      (attTot, currAtt) => attTot + currAtt.price * currAtt.quantity,
      0
    );

    return accTot + (currItem.price + attributesTot) * currItem.quantity;
  }, 0);
};

export const selectIsFetchingSnapshot = (state: RootState) =>
  state.cart.isFetchingSnapshot;

export const selectIsUpdatingSnapshot = (state: RootState) =>
  state.cart.isUpdatingSnapshot;

export const selectExcluded = (state: RootState) => state.cart.excluded;

export const selectItemCount = (state: RootState, itemId: string) =>
  state.cart.items.filter((item) => item.item_id === itemId).length;

export const selectItemQuantityByItemId = (state: RootState, id: string) => {
  const item = state.cart.items.find((e) => e.item_id === id);

  if (item) {
    return item.quantity;
  } else {
    return 0;
  }
};
