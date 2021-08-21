import { MAP_OBJECT, MAP_OBJECT_TYPE } from "../types/MapEntities";
import { Texture, Sprite, Point } from "pixi.js";

class CityObject implements MAP_OBJECT {
	public x: number;
	public y: number;
	public type: MAP_OBJECT_TYPE;
	public size: number = 1;
	public texture: Texture;
	public sprite: Sprite;

	public offsetX: number = 0;
	public offsetY: number = 0;
	public scale: number = 1;
	public anchor: Point = new Point(0, 1);

	constructor(x: number, y: number, texture: Texture, type: MAP_OBJECT_TYPE) {
		this.x = x;
		this.y = y;
		this.texture = texture;
		this.type = type;
	}
}

export default CityObject;
