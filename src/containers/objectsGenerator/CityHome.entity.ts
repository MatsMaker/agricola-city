import CityObject from "./CityObject.entity";
import { MAP_OBJECT_TYPE, IViewObject } from "../../types/MapEntities";

class CityHome extends CityObject implements IViewObject {
	public offsetX: number = -33;
	public offsetY: number = 26;
	public scale: number = 0.3;
	public size: number = 2;
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.HOME;
}

export default CityHome;
