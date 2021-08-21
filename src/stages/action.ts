import {
	ActionTypes,
	INITIATED_START_GAME_STAGE,
	INIT_START_GAME_STAGE,
} from "./types";

export function initStartGameAction(): ActionTypes {
	return {
		type: INIT_START_GAME_STAGE,
	};
}

export function initiatedStartGameAction(): ActionTypes {
	return {
		type: INITIATED_START_GAME_STAGE,
	};
}
