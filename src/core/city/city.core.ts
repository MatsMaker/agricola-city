import * as _ from "lodash";
import { IBaseMapObject, MAP_OBJECT_TYPE } from "../../types/MapEntities";
import { IConfigState } from "../config/config.reducer";
import { ICityState } from "./city.reducer";
import { inject, injectable } from "inversify";
import { StoreType } from "store";
import TYPES from "../../types/MainConfig";
import { IBuildActionRequest } from "./types";
import { Point } from "pixi.js";
import { mapArea } from "../../utils/area";

@injectable()
class CityCore {
	protected store: StoreType;

	// start cache data
	protected cityState: ICityState;
	protected configState: IConfigState;
	// end cache data

	constructor(@inject(TYPES.Store) store: StoreType) {
		this.store = store;
	}

	protected cacheDataInModel = () => {
		const { city, config } = this.store.getState();
		this.configState = { ...config };
		this.cityState = { ...city };
	};

	public initCity = (): ICityState => {
		this.cacheDataInModel();

		this.fillTerrainData();
		this.fillObjectsData();
		this.fillResidentsData();

		return {
			...this.cityState,
		};
	};

	public buildRequest = (buildRequest: IBuildActionRequest): ICityState => {
		this.cacheDataInModel();

		let nextState: ICityState;
		const { type, coordinate } = buildRequest;
		const { x, y } = coordinate;
		const buildArea: number = this.configState.buildsSizes[buildRequest.type];
		const placeIsEmpty = this.placeIsEmpty(coordinate, buildArea);

		if (placeIsEmpty) {
			const newBuild = {
				x: coordinate.x,
				y: coordinate.y,
				type,
			};
			mapArea(buildArea, (i, j) => {
				this.cityState.objects[y + i][x + j] = newBuild;
			});
			if (buildRequest.type == MAP_OBJECT_TYPE.HOME) {
				const { citySpawnPoint } = this.configState;
				const newMan = {
					x: citySpawnPoint.x,
					y: citySpawnPoint.y,
					type: MAP_OBJECT_TYPE.MAN,
				};
				this.cityState.residents.push(newMan);
				nextState = {
					...this.cityState,
					buildRequest,
					addManRequest: {
						coordinate: new Point(newMan.x, newMan.y),
					},
				};
			} else {
				nextState = {
					...this.cityState,
					buildRequest,
				};
			}
		} else {
			nextState = this.cityState;
		}
		return nextState;
	};

	protected placeIsEmpty(coordinate: Point, size: number): boolean {
		let placeIsEmpty: boolean = true;
		const { x, y } = coordinate;
		mapArea(size, (i, j) => {
			if (this.cityState.objects[y + i][x + j]) {
				placeIsEmpty = false;
			}
		});

		return placeIsEmpty;
	}

	protected forEachPoints(fn: (x: number, y: number) => void): void {
		const { citySize } = this.configState;
		for (let y: number = 0; y < citySize.height; y++) {
			for (let x: number = 0; x < citySize.width; x++) {
				fn(x, y);
			}
		}
	}

	protected createGreed = (): any[][] => {
		const greed: any[] = [];
		this.forEachPoints((x, y) => {
			if (!greed[y]) {
				greed[y] = [];
			}
			if (!greed[y][x]) {
				greed[y][x] = undefined;
			}
		});
		return greed;
	};

	protected fillTerrainData(): void {
		this.cityState.terrain = this.createGreed();
		this.forEachPoints((x, y) => {
			this.cityState.terrain[y][x] = {
				x,
				y,
				type: MAP_OBJECT_TYPE.LAND,
			};
		});
	}

	protected fillObjectsData(): void {
		const { startCityData } = this.configState;

		this.cityState.objects = this.createGreed();
		this.forEachPoints((x, y) => {
			const pointData = startCityData.find((d) => d.x === x && d.y === y); // TODO need extend for set big size objects
			if (pointData) {
				const objectSize = this.configState.buildsSizes[pointData.type];
				mapArea(objectSize, (i, j) => {
					this.cityState.objects[y + i][x + j] = {
						x,
						y,
						type: pointData.type,
					};
				});
			}
		});
	}

	protected fillResidentsData(): void {
		const cityWidth = this.configState.citySize.width;
		let currentObject;
		const roads: IBaseMapObject[] = [];
		this.cityState.residents = [];
		mapArea(cityWidth, (x, y) => {
			currentObject = this.cityState.objects[y][x];
			if (currentObject && currentObject.type === MAP_OBJECT_TYPE.ROAD) {
				roads.push(currentObject);
			}
		});

		const manIsOnRoad: IBaseMapObject = roads[_.random(0, roads.length - 1)];
		this.cityState.residents.push({
			x: manIsOnRoad.x,
			y: manIsOnRoad.y,
			type: MAP_OBJECT_TYPE.MAN,
		});
	}
}

export default CityCore;
