import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const interviewURL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const interviewApi = createApi({
  reducerPath: "interviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: interviewURL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    askVoiceInterview: builder.mutation({
      query: (body) => ({
        url: "/voice-interview",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAskVoiceInterviewMutation } = interviewApi;
