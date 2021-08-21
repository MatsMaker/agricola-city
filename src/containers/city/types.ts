import { MAP_OBJECT_TYPE } from "types/MapEntities";
import { Point } from "pixi.js";
import { BUILD, RENDER_CITY, RE_RENDER_CITY } from "./action";
import { ActionPayload, ActionType } from "../../types/actions";
import { MAP_OBJECT } from "../../types/MapEntities";

export type CityAction =
  | typeof RENDER_CITY
  | typeof RE_RENDER_CITY
  | typeof BUILD;

export type CityActionType = ActionType<CityAction>;

export type CityActionTypePayload<TPayload> = ActionPayload<
  CityAction,
  TPayload
>;
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
