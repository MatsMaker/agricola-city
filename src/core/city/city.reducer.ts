import { AnyAction } from "redux";
import { IBaseMapObject } from "../../types/MapEntities";
import { BUILD_REQUEST, INIT_CITY, REQUEST_COMPLETED } from "./action";
import { IBuildActionRequest } from "./types";
import TYPES from "../../types/MainConfig";
import CityCore from "./city.core";
import { main } from "../../main.config";

export interface ICityState {
	buildRequest: IBuildActionRequest;
	terrain: IBaseMapObject[][]; // TODO use immutable
	objects: IBaseMapObject[][]; // TODO use immutable
}

const initialState: ICityState = {
	buildRequest: undefined,
	terrain: [],
	objects: [],
};

export function cityReducer(
	state = initialState,
	action: AnyAction
): ICityState {
	switch (action.type) {
		case INIT_CITY: {
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
				buildRequest: undefined,
			};
		}
		default:
			return state;
	}
}
