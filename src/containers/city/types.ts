import { Point } from "pixi.js";
import { MAP_OBJECT } from "../../types/MapEntities";

export interface IsoPoint {
  position: Point;
  coordinate: Point;
}

export interface DrawCb {
  position: Point;
  data: MAP_OBJECT;
  coordinate: Point;
}
