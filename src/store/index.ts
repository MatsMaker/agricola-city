import { createStore } from "redux";
import { rootReducer } from "./reducer";
import { isDevelopment } from "../utils/build";

export const store = createStore(
	rootReducer,
	isDevelopment &&
	(<any>window).__REDUX_DEVTOOLS_EXTENSION__ &&
	(<any>window).__REDUX_DEVTOOLS_EXTENSION__()
);

export type StoreType = typeof store;
