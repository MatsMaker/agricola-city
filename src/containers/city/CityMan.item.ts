import { CityItem, MapPoint } from "./City.container";
import { Sprite } from "pixi.js";
import {
	IBaseMapObject,
	IViewObject,
	MAP_OBJECT_TYPE,
} from "../../types/MapEntities";
import { Point } from "pixi.js";
import { theSamePoint } from "../../utils/area";
import * as _ from 'lodash';

export default class CityManItem implements CityItem {
	public sprite: Sprite;
	public entity: IViewObject;
	public coordinate: Point;
	private from: Point;
	// private to: Point;
	// private speed: number = 300;

	public lookAround: () => IBaseMapObject[][]; //  city from ICityState;
	public onMoved: () => void = () => { };

	constructor(item: CityItem) {
		this.sprite = item.sprite;
		this.entity = item.entity;
		this.coordinate = item.coordinate;
		this.from = item.coordinate.clone();
	}

	public startMoveAnimation = () => {
		console.log("move animation", this.findNextPoint());
	};

	protected findNextPoint = (): Point => {
		const mapObjects = this.lookAround();
		const seePointDeff = [
			[-1, -1],
			[0, -1],
			[1, -1],
			[-1, 0],
			[1, 0],
			[-1, 1],
			[0, 1],
			[1, 1],
		];
		const pointsToMove: MapPoint[] = [];
		seePointDeff.forEach(([j, i]: number[]) => {
			if (
				mapObjects[this.coordinate.y + i] &&
				mapObjects[this.coordinate.y + i][this.coordinate.x + j] &&
				mapObjects[this.coordinate.y + i][this.coordinate.x + j].type ===
				MAP_OBJECT_TYPE.ROAD &&
				!theSamePoint(this.from, {
					x: this.coordinate.x + j,
					y: this.coordinate.y + i,
				})
			) {
				pointsToMove.push({
					x: this.coordinate.x + j,
					y: this.coordinate.y + i,
				});
			}
		});

		const willMoveToIndex = _.random(0, pointsToMove.length - 1);
		return new Point(
			pointsToMove[willMoveToIndex].x,
			pointsToMove[willMoveToIndex].y
		);
	};
}
