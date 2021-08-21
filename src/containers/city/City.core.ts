import * as _ from "lodash";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { IBaseMapObject, MAP_OBJECT_TYPE } from "../../types/MapEntities";
import { IConfigState } from "../../core/config/Config.reducer";
import { ICityState } from "./city.reducer";
import { IInitCityRequest } from "./types";

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
