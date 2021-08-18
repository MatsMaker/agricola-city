export const RENDER_BACKGROUND = '@CONTAINER/Background/render_background';
export const RE_RENDER_BACKGROUND = '@CONTAINER/Background/re_render_background';

interface InitBackground {
	type: typeof RENDER_BACKGROUND | typeof RE_RENDER_BACKGROUND
}


export type ActionTypes = InitBackground;