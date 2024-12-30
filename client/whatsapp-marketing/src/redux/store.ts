import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";

// Define a storage type for SSR (Server-Side Rendering)
let storage: any;
if (typeof window !== "undefined") {
  storage = require("redux-persist/lib/storage").default;
} else {
  storage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
}

// Combine reducers with strong typing
const rootReducer = combineReducers({
  user: userReducer,
});

// Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Define the store and dispatch types for proper typing in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persistor for Redux Persist
export const persistor = persistStore(store);
