import CityObject from './CityObject.entity';
import { Texture } from 'pixi.js';
import { MAP_OBJECT_TYPE } from 'types/MapEntities';
import { MAP_OBJECT } from '../types/MapEntities';

class CityBuild extends CityObject implements MAP_OBJECT {

	public offsetX: number = -33
	public offsetY: number = 26
	public scale: number = 0.3
	public size: number = 2

	constructor(
		x: number,
		y: number,
		texture: Texture,
		type: MAP_OBJECT_TYPE,
	) {
		super(x, y, texture, type)
	}

}

export default CityBuild
