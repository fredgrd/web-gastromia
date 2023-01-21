import axios, { AxiosError } from "axios";
import {
  CartItemSnapshot,
  CartSnapshot,
  isCartSnapshot,
} from "../../models/cart-snapshot";

const baseUrl = "https://api.gastromia.com";

export const fetchCartSnapshot = async (): Promise<CartSnapshot | null> => {
  try {
    const response = await axios.get(baseUrl + "/cart", {
      withCredentials: true,
    });
    const snapshot: CartSnapshot | any = response.data;

    if (snapshot && isCartSnapshot(snapshot)) {
      return snapshot;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `FetchCartSnapshot error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};

export const updateCartSnapshot = async (
  items: CartItemSnapshot[]
): Promise<CartSnapshot | null> => {
  try {
    const response = await axios.patch(
      baseUrl + "/cart/snapshot",
      { items_snapshot: items },
      {
        withCredentials: true,
      }
    );
    const snapshot: CartSnapshot | any = response.data;

    if (snapshot && isCartSnapshot(snapshot)) {
      return snapshot;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `UpdateCartSnapshot error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};
