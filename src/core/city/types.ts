import { MAP_OBJECT_TYPE } from "../../types/MapEntities";
import { Point } from 'pixi.js';

export interface IBuildActionRequest {
	type: MAP_OBJECT_TYPE;
	coordinate: Point;
}