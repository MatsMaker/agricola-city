import { AnyAction } from "redux";
import { MAP_OBJECT } from "../../types/MapEntities";

export interface ICityState {
	terrain: MAP_OBJECT[][];
	objects: MAP_OBJECT[][];
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
		default:
			return state;
	}
}
