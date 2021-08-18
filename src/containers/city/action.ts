import { RENDER_CITY, ActionTypes, RE_RENDER_CITY, BUILD } from './types';
import { MAP_OBJECT_TYPE } from 'types/MapEntities';
import { Point } from 'pixi.js';

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

export function  buildAction(objectType: MAP_OBJECT_TYPE, coordinate: Point) {
	return {
		type: BUILD,
		payload: {
			objectType,
			coordinate,
		}
	}
}