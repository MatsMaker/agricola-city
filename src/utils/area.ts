import * as _ from "lodash";

export function createMatrix<T>(
	sizeWidth: number,
	sizeHeight: number,
	aggregate: T
): T[][] {
	const row = _.times(sizeWidth, _.constant(aggregate));
	return _.times(sizeHeight, () => row);
}

export function mapArea(size: number, cb: (i: number, j: number) => void) {
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			cb(i, j);
		}
	}
}

export function theSamePoint(point1: { x: number, y: number }, point2: { x: number, y: number }) {
	return point1.x === point2.x && point1.y === point2.y;
}
