import * as _ from "lodash";
import AssetsLoader from "./assetsLoader/AssetsLoader";
import { IBaseMapObject, MAP_OBJECT_TYPE } from "../types/MapEntities";
import { IConfigState } from "./config/config.reducer";
import { ICityState } from "../containers/city/city.reducer";
import {
	IBuildActionRequest,
	IInitCityRequest,
} from "../containers/city/types";
import { injectable } from "inversify";

@injectable()
class CityCore {
	protected cityState: ICityState;
	public terrain: IBaseMapObject[][] = [];
	public objects: IBaseMapObject[][] = [];

	protected config: IConfigState;
	protected assetsLoader: AssetsLoader;

	public apply = ({ city, config }: IInitCityRequest): ICityState => {
		this.config = { ...config };
		this.cityState = { ...city };

		this.fillTerrainData();
		this.fillObjectsData();

		return {
			...this.cityState,
		};
	};

	public buildRequest = (
		buildRequest: IBuildActionRequest,
		city: ICityState
	): ICityState => {
		const { type, coordinate } = buildRequest;

		city.objects[coordinate.y][coordinate.x] = { // TODO mutable is said
			x: coordinate.x,
			y: coordinate.y,
			type,
		};

		return {
			...city,
			buildRequest,
		};
	};

	protected forEachPoints(fn: (x: number, y: number) => void): void {
		const { citySize } = this.config;
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
		const { startCityData } = this.config;

		this.cityState.objects = this.createGreed();
		this.forEachPoints((x, y) => {
			const pointData = startCityData.find((d) => d.x === x && d.y === y); // TODO need extend for set big size objects
			if (pointData) {
				const objectSize = this.config.buildsSizes[pointData.type];
				for (let i = 0; i < objectSize; i++) {
					for (let j = 0; j < objectSize; j++) {
						this.cityState.objects[y + i][x + j] = {
							x,
							y,
							type: pointData.type,
						};
					}
				}
			}
		});
	}
}

export default CityCore;
