import CityObject from "./CityObject.entity";
import { MAP_OBJECT, MAP_OBJECT_TYPE } from "../types/MapEntities";

class CityRoad extends CityObject implements MAP_OBJECT {
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.ROAD;
	public scale: number = 0.36;
}

export default CityRoad;
