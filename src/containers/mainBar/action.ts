import { ActionType } from "../../types/actions";
import { IMainMenuClick } from "./type";

export const BUTTON_MENU_CLICK = "@MAIN_MENU/button_menu_click";
export const INIT_MAIN_MENU = "@MAIN_MENU/init_menu";

export function initMainMenu(): ActionType {
	return { type: INIT_MAIN_MENU };
}

export function mainBarButtonClickAction(
	payload: IMainMenuClick
): ActionType<IMainMenuClick> {
	return {
		type: BUTTON_MENU_CLICK,
		payload,
	};
}
