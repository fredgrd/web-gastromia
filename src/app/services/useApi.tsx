import { useState } from "react";
import axios from "axios";

export interface IUseApiGetResponse {
  status: number;
  statusText: string;
  data: any;
  error: any;
  isLoading: boolean;
}

export const useApiGet = (
  url: string,
  options = { withCredentials: false }
): [trigger: () => void, response: IUseApiGetResponse] => {
  const [status, setStatus] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("");
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const trigger = async () => {
    setLoading(true);
    try {
      const apiResponse = await axios.get(url, {
        withCredentials: options.withCredentials,
      });
      setStatus(apiResponse.status);
      setStatusText(apiResponse.statusText);
      setData(apiResponse.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return [trigger, { status, statusText, data, error, isLoading }];
};

export const useApiPost = (
  url: string,
  options = { withCredentials: false }
): [trigger: (withData: any) => void, response: IUseApiGetResponse] => {
  const [status, setStatus] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("");
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const trigger = async (withData: any) => {
    setLoading(true);
    try {
      const apiResponse = await axios.post(url, withData, {
        withCredentials: options.withCredentials,
      });
      setStatus(apiResponse.status);
      setStatusText(apiResponse.statusText);
      setData(apiResponse.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return [trigger, { status, statusText, data, error, isLoading }];
};
