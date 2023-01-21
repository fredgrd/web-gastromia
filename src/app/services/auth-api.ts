import axios, { AxiosError } from "axios";
import { ApiOperation } from "../../models/api-operation";
import { isUser, User } from "../../models/user";

// --------------------------------------------------------------------------
// StartVerification

export const startVerification = async (
  number: string
): Promise<ApiOperation> => {
  try {
    const response = await axios.post("/auth/start", { number });

    return {
      success: true,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `StartVerification error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return {
      success: false,
      status: axiosError.response?.status,
    };
  }
};

// --------------------------------------------------------------------------
// CompleteVerification

interface CompleteVerificationResult extends ApiOperation {
  user: User | undefined;
}

export const completeVerification = async (
  number: string,
  code: string
): Promise<CompleteVerificationResult> => {
  try {
    const response = await axios.post("/auth/complete", { number, code });
    const user: User | any = response.data.user;

    if (user && isUser(user)) {
      // User exists
      return {
        success: true,
        status: response.status,
        user: user,
      };
    } else {
      return {
        success: true,
        status: response.status,
        user: undefined,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      status: axiosError.response?.status,
      user: undefined,
    };
  }
};

// --------------------------------------------------------------------------
// CompleteVerification

export const logout = async (): Promise<boolean> => {
  try {
    const response = await axios.get("/auth/logout", { withCredentials: true });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    
    console.log(`AuthApi/logout error: ${axiosError}`);
    return false;
  }
};
