import { ActionType } from "../../types/actions";

export const INIT_BACKGROUND = "@CONTAINER/Background/init_background";
export const RE_RENDER_BACKGROUND =
  "@CONTAINER/Background/re_render_background";

export function initBackgroundAction(): ActionType {
  return {
    type: INIT_BACKGROUND,
  };
}

export function reRenderBackgroundAction(): ActionType {
  return {
    type: RE_RENDER_BACKGROUND,
  };
}
