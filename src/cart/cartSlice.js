import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "cart",
  initialState: {
    value: [],
  },
  reducers: {
    addToCart: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
      state.value.push(action.payload);
    },
    removeItemFromCart: (state, action) => {
      let idx = state.value.findIndex((item) => item.id === action.payload.id);
      state.value.splice(idx, 1);
    },
    emptyCart: (state) => {
      state.value = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeItemFromCart, emptyCart } =
  counterSlice.actions;

export default counterSlice.reducer;
