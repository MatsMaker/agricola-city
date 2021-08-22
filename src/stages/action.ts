import { ActionType } from "../types/actions";

export const INIT_START_GAME_STAGE = "@STAGE/START_GAME/init_start_game";
export const INITIATED_START_GAME_STAGE =
	"@STAGE/START_GAME/initiated_start_game";
export const RESET_GAME_STAGE = "@STAGE/START_GAME/reset_game";

export function initStartGameAction(): ActionType {
	return {
		type: INIT_START_GAME_STAGE,
	};
}

export function resetGameAction(): ActionType {
	return {
		type: RESET_GAME_STAGE,
	};
}

export function initiatedStartGameAction(): ActionType {
	return {
		type: INITIATED_START_GAME_STAGE,
	};
}
