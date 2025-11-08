import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userLoggedIn, userLoggedOut } from './authSlice';


const USER_API = `${import.meta.env.VITE_API_BASE_URL}/api/user/`;

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: USER_API,credentials: 'include'}),
    endpoints: (builder) => ({
        //jab fetch karna ho to Query use karenge 
        //jab data post,update,delete karna ho to Mutation use karenge
        registerUser: builder.mutation({
            query: (userInput) => ({
                url: 'signUp',
                method: 'POST',
                body: userInput,
            }),
        }),
        loginUser: builder.mutation({
            query: (userInput) => ({    
                url: 'login',
                method: 'POST',
                body: userInput,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled; //queryFulfilled it will give complete user data
                    dispatch(userLoggedIn({ user: data.user }));
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
        logoutUser: builder.mutation({
            query:() =>({
                url: 'logout',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),

        loadUser: builder.query({
            query: () => ({
                url: 'profile',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled; //queryFulfilled it will give complete user data
                    dispatch(userLoggedIn({ user: data.user }));
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url:"profile/update",
                method:"PUT",
                body:formData,
                credentials:"include"
            })
        })
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation,useLoadUserQuery ,useUpdateUserMutation , useLogoutUserMutation} = authApi;