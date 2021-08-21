import { ASSETS_IS_LOADED } from "../core/assetsLoader/types";

export const PLAY = "@GAME/play";
export const END_ROUND = "@GAME/end_round";
export const START_ROUND = "@GAME/start_round";

interface BaseAction {
	type:
	| typeof PLAY
	| typeof END_ROUND
	| typeof ASSETS_IS_LOADED
	| typeof START_ROUND;
	payload?: any;
}

export type ActionTypes = BaseAction;

export enum GAME_STATE {
	LOAD_GAME = "LOAD_GAME",
	PREPARE_ROUND = "PREPARE_ROUND",
	PLAY_ROUND = "PLAY_ROUND",
	END_ROUND = "END_ROUND",
}

export interface IGameState {
	gameState: GAME_STATE;
}
