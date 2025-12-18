import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const USER_API = `${import.meta.env.VITE_API_BASE_URL}/api/group-study`;

export const groupStudyApi = createApi({
  reducerPath: "groupStudyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createRoom: builder.mutation({
      query: () => ({
        url: "/create",
        method: "POST",
      }),
    }),

    validateRoom: builder.query({
      query: (roomCode) => `/validate/${roomCode}`,
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useValidateRoomQuery,
} = groupStudyApi;
