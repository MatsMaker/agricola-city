import CityObject from "./CityObject.entity";
import { MAP_OBJECT } from "../types/MapEntities";

class CityLand extends CityObject implements MAP_OBJECT {
	public scale: number = 0.14;
}

export default CityLand;
