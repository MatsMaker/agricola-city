import { CityItem, MapPoint } from "./City.container";
import { Sprite } from "pixi.js";
import {
	IBaseMapObject,
	IViewObject,
	MAP_OBJECT_TYPE,
} from "../../types/MapEntities";
import { Point } from "pixi.js";
import { theSamePoint } from "../../utils/area";
import * as _ from "lodash";
import { TweenLite } from "gsap";
import { ICityManReduced } from "../../core/city/types";

export default class CityManItem implements CityItem {
	public sprite: Sprite;
	public entity: IViewObject;
	public coordinate: Point;
	private from: Point;
	// private to: Point;
	private moveSpeed: number = 1; // tile/sec

	public lookAround: () => IBaseMapObject[][]; //  city from ICityState;
	public onMoved: (data: ICityManReduced) => void = () => { };
	public getPositionByCoordinate: (position: Point) => Point;

	constructor(item: CityItem) {
		this.sprite = item.sprite;
		this.entity = item.entity;
		this.coordinate = item.coordinate;
		this.from = item.coordinate.clone();
	}

	public startMoveToNextPoint = () => {
		const nextCoordinatePoint = this.findNextPoint();
		const nextPositionPoint = this.getPositionByCoordinate(nextCoordinatePoint);
		TweenLite.to(this.sprite, this.moveSpeed, {
			x: nextPositionPoint.x,
			y: nextPositionPoint.y,
			ease: "none",
			onComplete: () => {
				this.from = this.coordinate.clone();
				this.coordinate = nextCoordinatePoint.clone();
				this.onMoved({
					entity: this.entity,
					newCoordinate: nextCoordinatePoint,
				});
			},
		});
	};

	protected findNextPoint = (): Point => { // TODO need fix choose nex point
		const mapObjects = this.lookAround();
		const seePointDeff = [
			// do not move by diagonal
			[0, -1],
			[-1, 0],
			[1, 0],
			[0, 1],
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
