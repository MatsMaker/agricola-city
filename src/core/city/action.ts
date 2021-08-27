import { IsoPoint } from "../../containers/city/types";
import { ActionType } from "../../types/actions";
import { IBuildActionRequest, ICityManReduced } from "./types";

export const INIT_CITY = "@CORE/City/init_city";
export const RESET_CITY = "@CORE/City/reset";
export const CITY_MODEL_IS_READY = "@CORE/City/city_model_is_ready";
export const RE_RENDER_CITY = "@CORE/City/re_render_city";
export const BUILD_REQUEST = "@CORE/City/build_request";
export const REQUEST_COMPLETED = "@CORE/City/request_completed";
export const ON_TERRAIN_CLICK = "@CORE/City/on_terrain_click";
export const CITY_MAN_REACHED = "@Core/City/city_man_reached";

export function initCity(): ActionType {
	return {
		type: INIT_CITY,
	};
}

export function resetCity(): ActionType {
	return {
		type: RESET_CITY,
	};
}

export function cityModelIsReady(): ActionType {
	return {
		type: CITY_MODEL_IS_READY,
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

export function cityManReducedAction(payload: ICityManReduced): ActionType<ICityManReduced> {
	return {
		type: CITY_MAN_REACHED,
		payload,
	}
}
