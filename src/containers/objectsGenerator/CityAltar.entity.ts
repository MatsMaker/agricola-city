import { MAP_OBJECT_TYPE, IViewObject } from "../../types/MapEntities";
import CityObject from './CityObject.entity';

class CityAltar extends CityObject implements IViewObject {
	public offsetX: number = -13;
	// public offsetY: number = 0;
	public scale: number = 0.3;
	public size: number = 1;
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.ALTAR;
}

export default CityAltar;
