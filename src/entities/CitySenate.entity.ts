import CityObject from "./CityObject.entity";
import { MAP_OBJECT_TYPE, MAP_OBJECT } from "../types/MapEntities";

class CitySenate extends CityObject implements MAP_OBJECT {
	public offsetX: number = -140;
	public offsetY: number = 137;
	public scale: number = 0.32;
	public size: number = 6;
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.SENATE;
}

export default CitySenate;
