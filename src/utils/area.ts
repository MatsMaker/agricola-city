import * as _ from "lodash";

export function createMatrix<T>(
	sizeWidth: number,
	sizeHeight: number,
	aggregate: T
): T[][] {
	const row = _.times(sizeWidth, _.constant(aggregate));
	return _.times(sizeHeight, () => row);
}
