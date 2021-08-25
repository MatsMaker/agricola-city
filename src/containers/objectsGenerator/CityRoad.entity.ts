import CityObject from "./CityObject.entity";
import { IViewObject, MAP_OBJECT_TYPE } from "../../types/MapEntities";

class CityRoad extends CityObject implements IViewObject {
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.ROAD;
	public scale: number = 0.33;
	public offsetX: number = 0;
	public offsetY: number = 0;
}

export default CityRoad;
