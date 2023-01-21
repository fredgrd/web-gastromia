import axios, { AxiosError } from "axios";
import { Card, isCards } from "../../models/card";

export const createSetupIntent = async (): Promise<string | null> => {
  try {
    const response = await axios.post("/payment/setup", {
      withCredentials: true,
    });
    const clientSecret: string | undefined = response.data.client_secret;

    if (clientSecret) {
      return clientSecret;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `CreateSetupIntent error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};

export const fetchCards = async (): Promise<Card[] | null> => {
  try {
    const response = await axios.get("/payment/cards", {
      withCredentials: true,
    });
    const cards: Card[] | undefined = response.data.cards;

    if (cards && isCards(cards)) {
      return cards;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `FetchCards error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};

export const detachCard = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.patch(
      "/payment/detach",
      { payment_method_id: id },
      {
        withCredentials: true,
      }
    );

    return true;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `DetachCard error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return false;
  }
};