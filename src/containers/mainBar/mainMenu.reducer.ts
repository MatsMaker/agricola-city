import { AnyAction } from "redux";
import { BUTTONS_TYPE } from "./type";
import { BUTTON_MENU_CLICK } from "./action";

export interface IMainMenuState {
	switcherActiveState: BUTTONS_TYPE;
}

const initialState: IMainMenuState = {
	switcherActiveState: BUTTONS_TYPE.ROAD,
};

export function mainMenuReducer(
	state = initialState,
	action: AnyAction
): IMainMenuState {
	switch (action.type) {
		case BUTTON_MENU_CLICK: {
			if (action.payload.buttonType !== BUTTONS_TYPE.RESET) {
				return {
					...state,
					switcherActiveState: action.payload.buttonType,
				};
			}
			return state;
		}
		default:
			return state;
	}
}
