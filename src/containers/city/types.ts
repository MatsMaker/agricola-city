export const RENDER_CITY = '@CONTAINER/City/render_city';
export const RE_RENDER_CITY = '@CONTAINER/City/re_render_city';
export const BUILD = '@CONTAINER/City/build';

interface InitCity {
	type: typeof RENDER_CITY | typeof RE_RENDER_CITY | typeof BUILD
}


export type ActionTypes = InitCity;