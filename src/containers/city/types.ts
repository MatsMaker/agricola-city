import { Point } from "pixi.js";
import { IViewObject } from "../../types/MapEntities";

export interface IsoPoint {
  position: Point;
  coordinate: Point;
}

export interface DrawBaseCb {
  position: Point;
  data: IViewObject;
}
export interface DrawCb extends DrawBaseCb {
  coordinate: Point;
}
