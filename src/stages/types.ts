export const INIT_START_GAME_STAGE = "@STAGE/START_GAME/init_start_game";
export const INITIATED_START_GAME_STAGE =
	"@STAGE/START_GAME/initiated_start_game";

interface BaseAction {
	type: typeof INIT_START_GAME_STAGE | typeof INITIATED_START_GAME_STAGE;
}

export type ActionTypes = BaseAction;
