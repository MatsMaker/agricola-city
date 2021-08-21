import { combineReducers } from "redux";
import { assetsReducer } from "../core/assetsLoader/assets.reducer";
import { lastAction } from "./lastAction.reducer";
import { viewPortReducer } from "../core/viewPort/viewPort.reducer";
import { configReducer } from "../core/config/Config.reducer";
import { cityReducer } from "../containers/city/city.reducer";

export const rootReducer = combineReducers({
	config: configReducer,
	assets: assetsReducer,
	viewPort: viewPortReducer,
	city: cityReducer,
	lastAction,
});
