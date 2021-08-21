import { combineReducers } from "redux";
import { assetsReducer } from "../core/assetsLoader/assets.reducer";
import { lastAction } from "./lastAction.reducer";
import { viewPortReducer } from "../core/viewPort/viewPort.reducer";

export const rootReducer = combineReducers({
	assets: assetsReducer,
	viewPort: viewPortReducer,
	lastAction,
});
