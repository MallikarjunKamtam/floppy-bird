import { configureStore } from "@reduxjs/toolkit";

import birdReducer from "./app.slice";

const store = configureStore({ reducer: birdReducer });

export default store;
