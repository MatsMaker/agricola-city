import { AssetsActionTypes, AssetsState, ASSETS_IS_LOADED } from "./types";

const initialState: AssetsState = {
  assetsIsLoaded: false,
};

export function assetsReducer(
  state = initialState,
  action: AssetsActionTypes
): AssetsState {
  switch (action.type) {
    case ASSETS_IS_LOADED: {
      return {
        ...state,
        assetsIsLoaded: true,
      };
    }
    default:
      return state;
  }
}
