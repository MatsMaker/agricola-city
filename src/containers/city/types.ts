import { MAP_OBJECT_TYPE } from "types/MapEntities";
import { Point } from "pixi.js";
import { MAP_OBJECT } from "../../types/MapEntities";

export interface BuildActionRequest {
  objectType: MAP_OBJECT_TYPE;
  coordinate: Point;
}

export interface IsoPoint {
  position: Point;
  coordinate: Point;
}

export interface DrawCb {
  position: Point;
  data: MAP_OBJECT;
  coordinate: Point;
}
