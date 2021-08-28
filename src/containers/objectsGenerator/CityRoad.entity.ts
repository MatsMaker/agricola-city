import CityObject from "./CityObject.entity";
import { IViewObject, MAP_OBJECT_TYPE } from "../../types/MapEntities";
import { Point, Texture } from "pixi.js";
import roadMasksTypes, { IRoadMask } from "../../core/RoadMaskTypes";

class CityRoad extends CityObject implements IViewObject {
	public type: MAP_OBJECT_TYPE = MAP_OBJECT_TYPE.ROAD;
	public scale: number = 0.33;
	public offsetX: number = 0;
	public offsetY: number = 0;
	public bias: Point = new Point(0, 0);

	constructor(x: number, y: number, texture: Texture) {
		super(x, y, texture);
		this.x = x;
		this.y = y;
		const bias: Point = this.getBiasOfTexture(texture);
		this.offsetX = bias.x;
		this.offsetY = bias.y;

		this.texture = texture;
	}

	protected getBiasOfTexture = (texture: Texture): Point => {
		const roadMask: IRoadMask = roadMasksTypes.find((rmt: IRoadMask) => {
			return texture.textureCacheIds[0] === rmt.textureTile;
		});
		return roadMask.bias;
	};
}

export default CityRoad;
