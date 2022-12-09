import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useApiGet } from "./useApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

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
  const [trigger, { data, error, isLoading }] = useApiGet(
    "user/fetch",
    {
      withCredentials: true,
    }
  );
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
    dispatch(setCredentials({ user: user }));
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
    const response = await axios.get("user/fetch", { withCredentials: true });

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

export interface StartVerificationResult {
  success: boolean;
  status: number | undefined;
}

export const startVerification = async (
  number: string
): Promise<StartVerificationResult> => {
  try {
    const response = await axios.post("auth/start", { number });
    return {
      success: true,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      status: axiosError.response?.status,
    };
  }
};

export interface CheckVerificationResult {
  user: User | undefined;
  status: number | undefined;
}

export const checkVerification = async (
  number: string,
  code: string
): Promise<CheckVerificationResult> => {
  try {
    const response = await axios.post("auth/checkcode", { number, code });

    if (response.data && isUser(response.data)) {
      return {
        user: response.data,
        status: response.status,
      };
    } else {
      return {
        user: undefined,
        status: response.status,
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

export interface CreateUserResult {
  user: User | undefined;
  status: number | undefined;
}

export const createUser = async (name: string): Promise<CreateUserResult> => {
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
