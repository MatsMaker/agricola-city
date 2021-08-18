import { MAP_OBJECT, MAP_OBJECT_TYPE } from '../../types/MapEntities';
import { Texture, Sprite } from 'pixi.js';

class Land implements MAP_OBJECT {

	public x: number
	public y: number
	public type: MAP_OBJECT_TYPE.LAND
	public size: 1
	public texture: Texture
	public sprite: Sprite

	constructor(
		x: number,
		y: number,
		texture: Texture,
	) {
		this.x = x
		this.y = y
		this.texture = texture
	}

}

export default Land