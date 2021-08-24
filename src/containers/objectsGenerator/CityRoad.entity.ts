import CityObject from "./CityObject.entity";
import { IViewObject, MAP_OBJECT_TYPE } from "../../types/MapEntities";

class CityRoad extends CityObject implements IViewObject {
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.ROAD;
	public scale: number = 0.35;
}

export default CityRoad;
