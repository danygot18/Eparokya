import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: { posts: [], comments: [] },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload
        },
        setComments: (state, action) => {
            state.comments = action.payload
        }
    }
})

export const { setPosts, setComments } = postSlice.actions

export default postSlice.reducer