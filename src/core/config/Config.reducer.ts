import { IBaseMapObject } from "../../types/MapEntities";
import { SETTINGS_PREPARE } from "./action";
import { IAreaSizeType } from "./types";
import * as settings from "../../settings.json";
import { AnyAction } from "redux";

export interface IConfigState {
	assetsPath: string;
	assetsList: string[];
	fonts: any;
	citySize: IAreaSizeType;
	startCityData: IBaseMapObject[];
}

const initialState: IConfigState = settings as IConfigState;

export function configReducer(
	state = initialState,
	action: AnyAction
): IConfigState {
	switch (action.type) {
		case SETTINGS_PREPARE: {
		}
		default:
			return state;
	}
}
