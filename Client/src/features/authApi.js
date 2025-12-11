import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userLoggedIn, userLoggedOut } from './authSlice';

const USER_API = `${import.meta.env.VITE_API_BASE_URL}/api/user/`;

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: USER_API, credentials: 'include' }),
    tagTypes: ["User"],

    endpoints: (builder) => ({

        registerUser: builder.mutation({
            query: (userInput) => ({
                url: 'signUp',
                method: 'POST',
                body: userInput,
            }),
            invalidatesTags: ["User"]
        }),

        loginUser: builder.mutation({
            query: (userInput) => ({
                url: 'login',
                method: 'POST',
                body: userInput,
                 credentials: 'include',
            }),
            invalidatesTags: ["User"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userLoggedIn({ user: data.user }));
                } catch (error) { }
            },
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: 'logout',
                method: 'GET',
                credentials: "include",
            }),
            invalidatesTags: ["User"],
            async onQueryStarted(arg, { dispatch }) {
                dispatch(userLoggedOut());
            },
        }),

        loadUser: builder.query({
            query: () => ({ url: 'profile', method: 'GET' }),
            providesTags: ["User"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userLoggedIn({ user: data.user }));
                } catch (error) { }
            },
        }),

        updateUser: builder.mutation({
            query: (formData) => ({
                url: "profile/update",
                method: "PUT",
                body: formData,
                credentials: "include"
            }),
            invalidatesTags: ["User"]
        }),
        
        saveQuizResult: builder.mutation({
            query: (data) => ({
                url: "quiz/save-result",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),
    }),
});


export const { useRegisterUserMutation, useLoginUserMutation, useLoadUserQuery, useUpdateUserMutation, useLogoutUserMutation, useSaveQuizResultMutation } = authApi;