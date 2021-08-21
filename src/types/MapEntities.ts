import { Texture, Sprite, Point } from "pixi.js";

export enum MAP_OBJECT_TYPE {
	LAND = "LAND",
	ROAD = "ROAD",
	HOME = "HOME",
	SENAT = "SENAT",
}

export interface BASE_MAP_OBJECT {
	x: number;
	y: number;
	type: MAP_OBJECT_TYPE;
}

export interface MAP_OBJECT extends BASE_MAP_OBJECT {
	size: number;
	texture: Texture;
	sprite: Sprite;

	offsetX?: number;
	offsetY?: number;
	scale?: number;
	anchor?: Point;

	id?: string | number;
}
