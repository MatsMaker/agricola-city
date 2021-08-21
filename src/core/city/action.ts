import { IsoPoint } from "../../containers/city/types";
import { ActionType } from "../../types/actions";
import { IBuildActionRequest } from "./types";

export const INIT_CITY = "@CONTAINER/City/init_city";
export const CITY_MODEL_IS_READY = "@CONTAINER/City/city_model_is_ready";
export const RENDER_CITY = "@CONTAINER/City/render_city";
export const RE_RENDER_CITY = "@CONTAINER/City/re_render_city";
export const BUILD_REQUEST = "@CONTAINER/City/build_request";
export const REQUEST_COMPLETED = "@CONTAINER/City/request_completed";
export const ON_TERRAIN_CLICK = "@CONTAINER/City/on_terrain_click";

export function initCity(): ActionType {
	return {
		type: INIT_CITY,
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

export function buildAction(
	payload: IBuildActionRequest
): ActionType<IBuildActionRequest> {
	return {
		type: BUILD_REQUEST,
		payload,
	};
}

export function requestCompletedAction(): ActionType {
	return {
		type: REQUEST_COMPLETED,
	};
}

export function onTerrainClickAction(payload: IsoPoint): ActionType<IsoPoint> {
	return {
		type: ON_TERRAIN_CLICK,
		payload,
	};
}
