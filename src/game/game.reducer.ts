import {
  IGameState,
  ActionTypes,
  GAME_STATE,
  START_ROUND
} from './types'
import { ASSETS_IS_LOADED } from '../core/assetsLoader/types'

const initialState: IGameState = {
  gameState: GAME_STATE.LOAD_GAME,
}

export function gameReducer(
  state = initialState,
  action: ActionTypes
): IGameState {

  switch (action.type) {
    case ASSETS_IS_LOADED: {
      return {
        ...state,
        gameState: GAME_STATE.PREPARE_ROUND,
      }
    }
    case START_ROUND: {
      return {
        ...state,
      }
    }
    default:
      return state
  }
}