import { BuildActionRequest, IInitCityRequest, IsoPoint } from "./types";
import { ActionType } from '../../types/actions';

export const INIT_CITY = "@CONTAINER/City/init_city";
export const CITY_MODEL_IS_READY = "@CONTAINER/City/city_model_is_ready";
export const RENDER_CITY = "@CONTAINER/City/render_city";
export const RE_RENDER_CITY = "@CONTAINER/City/re_render_city";
export const BUILD = "@CONTAINER/City/build";
export const ON_TERRAIN_CLICK = "@CONTAINER/City/on_terrain_click";

export function initCity(payload: IInitCityRequest): ActionType<IInitCityRequest> {
	return {
		type: INIT_CITY,
		payload,
	};
}

export function cityModelIsReady(): ActionType {
	return {
		type: CITY_MODEL_IS_READY,
	};
}

export function renderCityAction(): ActionType {
	return {
		type: RENDER_CITY,
	};
}

export function reRenderCityAction(): ActionType {
	return {
		type: RE_RENDER_CITY,
	};
}

export function buildAction(payload: BuildActionRequest): ActionType<BuildActionRequest> {
	return {
		type: BUILD,
		payload,
	};
}

export function onTerrainClickAction(payload: IsoPoint): ActionType<IsoPoint> {
	return {
		type: ON_TERRAIN_CLICK,
		payload,
	};
}
