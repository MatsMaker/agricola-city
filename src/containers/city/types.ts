import { MAP_OBJECT_TYPE } from "types/MapEntities";
import { Point } from "pixi.js";
import { MAP_OBJECT } from "../../types/MapEntities";
import { ICityState } from './city.reducer';
import { IConfigState } from '../../core/config/config.reducer';

export interface IBuildActionRequest {
  type: MAP_OBJECT_TYPE;
  coordinate: Point;
}

export interface IsoPoint {
  position: Point;
  coordinate: Point;
}

export interface IInitCityRequest {
  city: ICityState;
  config: IConfigState;
}

export interface DrawCb {
  position: Point;
  data: MAP_OBJECT;
  coordinate: Point;
}
