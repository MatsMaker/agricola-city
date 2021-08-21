import { ASSETS_IS_LOADED } from "./types";
import { ActionType } from '../../types/actions';

export function assetsIsLoadedAction(): ActionType {
  return {
    type: ASSETS_IS_LOADED,
  };
}
