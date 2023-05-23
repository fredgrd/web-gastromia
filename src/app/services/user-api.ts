import axios, { AxiosError } from 'axios';
import { User, isUser } from '../../models/user';

const baseUrl = 'https://api-gastromia.fly.dev';

// Fetches the user document
export const fetchUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get(baseUrl + '/user/fetch', {
      withCredentials: true,
    });
    const user: User | any = response.data;

    if (user && isUser(user)) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `FetchUser error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};

// Creates a new user
export const createUser = async (name: string): Promise<User | null> => {
  try {
    const response = await axios.post(
      baseUrl + '/user/create',
      { name },
      { withCredentials: true }
    );
    const user: User | any = response.data;

    if (user && isUser(user)) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `CreateUser error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};

// Update the user name
export const updateUser = async (update: {
  name?: string;
  email?: string;
}): Promise<User | null> => {
  // One must be updated
  if (!update.name && !update.email) {
    return null;
  }

  try {
    const response = await axios.patch(
      baseUrl + '/user/update',
      { update: update },
      { withCredentials: true }
    );
    const user: User | any = response.data;

    if (user && isUser(user)) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    return null;
  }
};
