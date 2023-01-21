import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import { Item, isItems, isItem } from "../../models/item";

export const fetchCategory = async (
  category: string
): Promise<Item[] | null> => {
  try {
    const response = await axios.get(`/items/category?c=${category}`);
    const items: Item[] | any = response.data.items;

    if (items && isItems(items)) {
      return items;
    } else {
      console.log("FetchCategory error: NoItems")
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `FetchCategory error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};

export const searchItems = async (query: string): Promise<Item[] | null> => {
  try {
    const response = await axios.get(
      `/items/search?k=${query}&search_id=${uuidv4()}`
    );
    const items: Item[] | any = response.data.items;

    console.log(
      "SEARCHITEMS:",
      response.data.items,
      isItems(response.data.items)
    );

    if (items && isItems(items)) {
      return items;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `SearchItems error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};

export const fetchItem = async (id: string): Promise<Item | null> => {
  try {
    const response = await axios.get(`/items/item?i=${id}`, {
      withCredentials: true,
    });
    const item: Item | any = response.data;
    
    if (item && isItem(item)) {
      return item;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `FetchItem error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};