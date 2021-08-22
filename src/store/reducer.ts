import { combineReducers } from "redux";
import { assetsReducer } from "../core/assetsLoader/assets.reducer";
import { lastAction } from "./lastAction.reducer";
import { viewPortReducer } from "../core/viewPort/viewPort.reducer";
import { configReducer } from "../core/config/config.reducer";
import { cityReducer } from "../core/city/city.reducer";
import { mainMenuReducer } from "../containers/mainBar/mainMenu.reducer";

export const rootReducer = combineReducers({
	lastAction,
	config: configReducer,
	assets: assetsReducer,
	city: cityReducer,
	mainMenu: mainMenuReducer,
	viewPort: viewPortReducer,
});
