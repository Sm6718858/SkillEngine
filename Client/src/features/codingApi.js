import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CODING_API = `${import.meta.env.VITE_API_BASE_URL}/api/coding/`;

export const codingApi = createApi({
  reducerPath: "codingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CODING_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    submitSolution: builder.mutation({
      query: (body) => ({
        url: "submit",
        method: "POST",
        body,
      }),
    }),

    getProblems: builder.query({
      query: () => ({
        url: "getProblems",
        method: "GET",
      }),
    }),

    getSingleProblem: builder.query({
      query: (id) => ({
        url: `problems/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSubmitSolutionMutation,
  useGetProblemsQuery,
  useGetSingleProblemQuery,
} = codingApi;
