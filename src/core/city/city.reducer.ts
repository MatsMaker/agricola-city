import { AnyAction } from "redux";
import { IBaseMapObject, IViewObject } from "../../types/MapEntities";
import {
	BUILD_REQUEST,
	INIT_CITY,
	CITY_MAN_REACHED,
	REQUEST_COMPLETED,
	RESET_CITY,
} from "./action";
import { IBuildActionRequest, IRequestAddCityMan } from "./types";
import TYPES from "../../types/MainConfig";
import CityCore from "./city.core";
import { main } from "../../main.config";

export interface ICityState {
	addManRequest: IRequestAddCityMan;
	buildRequest: IBuildActionRequest;
	terrain: IBaseMapObject[][]; // TODO use immutable
	objects: IBaseMapObject[][];
	mans: IBaseMapObject[];
}

const initialState: ICityState = {
	addManRequest: undefined,
	buildRequest: undefined,
	terrain: [],
	objects: [],
	mans: [],
};

export function cityReducer(
	state = initialState,
	action: AnyAction
): ICityState {
	switch (action.type) {
		case INIT_CITY:
		case RESET_CITY: {
			const cityCore: CityCore = main.get(TYPES.CityCore);
			const nextState = cityCore.initCity();
			return { ...nextState };
		}
		case BUILD_REQUEST: {
			const cityCore: CityCore = main.get(TYPES.CityCore);
			const nextCityStore: ICityState = cityCore.buildRequest(action.payload);
			return {
				...nextCityStore,
			};
		}
		case REQUEST_COMPLETED: {
			return {
				...state,
				addManRequest: undefined,
				buildRequest: undefined,
			};
		}
		case CITY_MAN_REACHED: {
			const newMans = state.mans.map((m: IViewObject) => {
				if (m.uid === action.payload.entity.uid) {
					m.x = action.payload.newCoordinate.x;
					m.y = action.payload.newCoordinate.y;
				}
				return m;
			});
			return {
				...state,
				mans: newMans,
			};
		}
		default:
			return state;
	}
}
