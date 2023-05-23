import axios, { AxiosError } from "axios";

const baseUrl = "https://api-gastromia.fly.dev";

export const fetchLocationStatus = async (): Promise<boolean> => {
  try {
    const response = await axios.get(baseUrl + "/location/status");
    const status: boolean | any = response.data.is_open;

    if (status && typeof status === "boolean") {
      return status;
    } else {
      return false;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `FetchLocationStatus error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return false;
  }
};
