import CityObject from "./CityObject.entity";
import { MAP_OBJECT, MAP_OBJECT_TYPE } from "../types/MapEntities";

class CityLand extends CityObject implements MAP_OBJECT {
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.LAND;
	public scale: number = 0.15;
}

export default CityLand;
