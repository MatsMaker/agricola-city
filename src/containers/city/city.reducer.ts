import { AnyAction } from "redux";
import { IBaseMapObject } from "../../types/MapEntities";
import { BUILD, INIT_CITY } from "./action";
import CityCore from "./City.core";

const cityCore = new CityCore();

export interface ICityState {
	terrain: IBaseMapObject[][]; // TODO use immutable
	objects: IBaseMapObject[][]; // TODO use immutable
}

const initialState: ICityState = {
	terrain: [],
	objects: [],
};

export function cityReducer(
	state = initialState,
	action: AnyAction
): ICityState {
	switch (action.type) {
		case INIT_CITY: {
			return { ...cityCore.apply(action.payload) };
		}
		case BUILD: {
			return state;
		}
		default:
			return state;
	}
}
