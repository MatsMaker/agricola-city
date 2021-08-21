import { AssetsState, ASSETS_IS_LOADED } from "./types";
import { AnyAction } from "redux";

const initialState: AssetsState = {
  assetsIsLoaded: false,
};

export function assetsReducer(
  state = initialState,
  action: AnyAction
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
