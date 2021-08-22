import { Texture, Sprite, Point } from "pixi.js";

export enum MAP_OBJECT_TYPE {
	LAND = "LAND",
	ROAD = "ROAD",
	ALTAR = "ALTAR",
	HOME = "HOME",
	SENATE = "SENATE",
}

export interface IBaseMapObject {
	x: number;
	y: number;
	type: MAP_OBJECT_TYPE;
}

export interface IViewObject extends IBaseMapObject {
	size: number;
	texture: Texture;
	sprite: Sprite;

	offsetX?: number;
	offsetY?: number;
	scale?: number;
	anchor?: Point;

	id?: string | number;
}
