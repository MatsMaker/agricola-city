import { RENDER_CITY, ActionTypes, RE_RENDER_CITY } from './types';

export function renderCityAction(): ActionTypes {
	return {
		type: RENDER_CITY,
	}
}

export function  reRenderCityAction(): ActionTypes {
	return {
		type: RE_RENDER_CITY,
	}
}