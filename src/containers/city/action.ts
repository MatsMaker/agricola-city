import { BuildActionRequest, CityActionType, IsoPoint } from "./types";

export const RE_RENDER_CITY = "@CONTAINER/City/re_render_city";
export const BUILD = "@CONTAINER/City/build";
export const RENDER_CITY = "@CONTAINER/City/render_city";
export const ON_TERRAIN_CLICK = "@CONTAINER/City/on_terrain_click";

export function renderCityAction(): CityActionType {
	return {
		type: RENDER_CITY,
	};
}

export function reRenderCityAction(): CityActionType {
	return {
		type: RE_RENDER_CITY,
	};
}

export function buildAction(payload: BuildActionRequest) {
	return {
		type: BUILD,
		payload,
	};
}

export function onTerrainClickAction(payload: IsoPoint) {
	return {
		type: ON_TERRAIN_CLICK,
		payload,
	};
}
