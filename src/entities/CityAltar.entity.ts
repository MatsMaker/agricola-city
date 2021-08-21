import CityObject from "./CityObject.entity";
import { MAP_OBJECT_TYPE, MAP_OBJECT } from "../types/MapEntities";

class CityAltar extends CityObject implements MAP_OBJECT {
	public offsetX: number = -13;
	// public offsetY: number = 0;
	public scale: number = 0.3;
	public size: number = 1;
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.ALTAR;
}

export default CityAltar;
