import { createSlice } from "@reduxjs/toolkit";

const preferenceSlice = createSlice({
    name: 'preferences',
    initialState: { theme: null },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload; // assuming you're setting the theme, not user
        },
    }
});

export const { setTheme } = preferenceSlice.actions;

export default preferenceSlice.reducer;