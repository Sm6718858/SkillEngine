import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CODING_API = `${import.meta.env.VITE_API_BASE_URL}/api/`;

export const codingApi = createApi({
  reducerPath: "codingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CODING_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // existing
    submitSolution: builder.mutation({
      query: (body) => ({
        url: "coding/submit",
        method: "POST",
        body,
      }),
    }),

    getProblems: builder.query({
      query: () => "coding/getProblems",
    }),

    // 🔥 NEW — AI IMPROVE
    improveCodeWithAI: builder.mutation({
      query: (body) => ({
        url: "compiler-ai/improve",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSubmitSolutionMutation,
  useGetProblemsQuery,
  useImproveCodeWithAIMutation, // 👈 export this
} = codingApi;
