import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useApiGet } from "./useApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store-slices/auth-slice";
import { v4 as uuidv4 } from "uuid";

import { Item } from "../../models/item";

export interface User {
  id: string;
  name: string;
  number: string;
}

const isUser = (user: any): user is User => {
  const weakCast = user as User;
  return (
    weakCast.id !== undefined &&
    weakCast.name !== undefined &&
    weakCast.number !== undefined
  );
};

export const useGetUser = () => {
  const [trigger, { data, error, isLoading }] = useApiGet("/user/fetch", {
    withCredentials: true,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    trigger();
  }, [trigger]);

  // Check loading
  if (isLoading) {
    console.log("useGetUser is loading");
    return;
  }

  if (error) {
    console.log("ERROR fetching user", error);
  }

  if (data && isUser(data)) {
    const user = data as User;
    console.log("user", user.id, user);
    // dispatch(setCredentials({ user: user }));l
  } else {
    console.log("Failed casting");
  }
};

export interface GetUserResult {
  user: User | undefined;
  status: number | undefined;
}

export const getUser = async (): Promise<GetUserResult> => {
  try {
    const response = await axios.get("/user/fetch", { withCredentials: true });

    if (response.data && isUser(response.data)) {
      return {
        user: response.data,
        status: response.status,
      };
    } else {
      return {
        user: undefined,
        status: 400,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      user: undefined,
      status: axiosError.response?.status,
    };
  }
};

export const createUser = async (name: string) => {
  try {
    const response = await axios.post(
      "user/create",
      { name },
      { withCredentials: true }
    );

    if (response.data && isUser(response.data)) {
      return {
        user: response.data,
        status: response.status,
      };
    } else {
      return {
        user: undefined,
        status: 400,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError;

    return {
      user: undefined,
      status: axiosError.response?.status,
    };
  }
};

// -----------------------------------------------------------------------
// ITEM API

export interface SearchItemsResult {
  items: [Item] | undefined;
  status: number | undefined;
}



export interface FetchCategoryItemsResult {
  items: [Item] | undefined;
  status: number | undefined;
}


export interface FetchItemResult {
  item: Item | undefined;
  status: number | undefined;
}