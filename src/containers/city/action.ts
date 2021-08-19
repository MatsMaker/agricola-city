import { BuildActionRequest, CityActionType } from "./types";

export const RE_RENDER_CITY = '@CONTAINER/City/re_render_city';
export const BUILD = '@CONTAINER/City/build';
export const RENDER_CITY = '@CONTAINER/City/render_city';

export function renderCityAction(): CityActionType {
	return {
		type: RENDER_CITY,
	}
}

export function  reRenderCityAction(): CityActionType {
	return {
		type: RE_RENDER_CITY,
	}
}

export function  buildAction(payload: BuildActionRequest) {
	return {
		type: BUILD,
		payload,
	}
}