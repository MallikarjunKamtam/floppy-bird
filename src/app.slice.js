import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGameOn: false,
  score: 0,
  isGameOver: false,
};

const birdSlice = createSlice({
  name: "bird",
  initialState: initialState,
  reducers: {
    setGameOn: (state, action) => {
      state.isGameOn = action.payload;
    },
    setScore: (state, action) => {
      state.score = action.payload;
    },
    setGameOver: (state, action) => {
      state.isGameOver = action.payload;
    },
  },
});

export default birdSlice.reducer;

export const birdActions = birdSlice.actions;

export const birdState = (state) => state;
