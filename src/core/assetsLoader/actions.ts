import { ASSETS_IS_LOADED, AssetsActionTypes } from "./types";

export function assetsIsLoadedAction(): AssetsActionTypes {
  return {
    type: ASSETS_IS_LOADED,
  };
}
