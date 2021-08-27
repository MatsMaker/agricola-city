import { Point, Sprite, Texture } from "pixi.js";
import { IViewObject, MAP_OBJECT_TYPE } from "../../types/MapEntities";

class CityManEntity implements IViewObject {
	public x: number;
	public y: number;
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.MAN;
	public size: number = 1;
	public texture: Texture;
	public sprite: Sprite;

	public offsetX: number = 0;
	public offsetY: number = 0;
	public scale: number = 0.5;
	public anchor: Point = new Point(0, 1);
	public uid: any;

	constructor(x: number, y: number, texture: Texture, uid: any) {
		this.x = x;
		this.y = y;
		this.texture = texture;
		this.uid = uid;
	}
}

export default CityManEntity;
