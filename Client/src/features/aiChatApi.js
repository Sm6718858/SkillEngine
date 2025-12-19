import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiChatApi = createApi({
  reducerPath: "aiChatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + "/api/ai",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    askLectureAI: builder.mutation({
      query: (body) => ({
        url: "/lecture-chat",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAskLectureAIMutation } = aiChatApi;
