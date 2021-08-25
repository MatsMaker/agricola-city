import CityObject from "./CityObject.entity";
import { MAP_OBJECT_TYPE, IViewObject } from "../../types/MapEntities";

class CityLand extends CityObject implements IViewObject {
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.LAND;
	public scale: number = 0.15;
}

export default CityLand;
