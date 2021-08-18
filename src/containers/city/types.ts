export const RENDER_CITY = '@CONTAINER/City/render_city';
export const RE_RENDER_CITY = '@CONTAINER/City/re_render_city';

interface InitCity {
	type: typeof RENDER_CITY | typeof RE_RENDER_CITY
}


export type ActionTypes = InitCity;