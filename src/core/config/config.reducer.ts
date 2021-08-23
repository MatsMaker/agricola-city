import { IBaseMapObject } from "../../types/MapEntities";
import { SETTINGS_PREPARE } from "./action";
import { IAreaSizeType, IBuildsSizes } from "./types";
import * as settings from "../../settings.json";
import { AnyAction } from "redux";
import { Point } from 'pixi.js';

export interface IConfigState {
	assetsPath: string;
	assetsList: string[];
	fonts: any;
	citySize: IAreaSizeType;
	citySpawnPoint: Point;
	startCityData: IBaseMapObject[];
	buildsSizes: IBuildsSizes;
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
