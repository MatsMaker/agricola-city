import { MAP_OBJECT_TYPE } from "../../types/MapEntities";

export interface IAreaSizeType {
	width: number;
	height: number;
	tileWidth: number;
	tileHeight: number;
	distortionFactor: number;
}

export type IBuildsSizes = {
	[key in MAP_OBJECT_TYPE]: number;
}

export interface GSettings {
	assetsPath: string;
	[key: string]: any;
}
