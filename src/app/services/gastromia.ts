import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  _id: string;
  name: string;
  number: string;
}

export interface VerificationStartResponse {}

export const gastromiaApi = createApi({
  reducerPath: "gastromiaApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "development"
        ? "/"
        : "https://api.gastromia.com",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => "user/fetch",
    }),

    cookie: builder.query<void, void>({
      query: () => "auth/cookie",
    }),
    readCookie: builder.query<void, void>({
      query: () => "auth/readcookie",
    }),

    startVerification: builder.mutation<unknown, string>({
      query: (number) => ({
        url: "auth/start",
        method: "POST",
        body: { number },
        responseHandler: (response) => {
          // if (response.status === 200) {
          //   return response.json();
          // }
          return response.text();
        },
      }),
      transformErrorResponse: (response) => {
        return response.status;
      },
    }),

    checkVerification: builder.mutation<
      { token: string },
      { number: string; code: string }
    >({
      query: (credentials) => ({
        url: "auth/checkcode",
        method: "POST",
        body: credentials,
        responseHandler: (response) => response.text(),
      }),
      transformErrorResponse: (response) => {
        return response.status;
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useCookieQuery,
  useReadCookieQuery,
  useStartVerificationMutation,
  useCheckVerificationMutation,
} = gastromiaApi;
