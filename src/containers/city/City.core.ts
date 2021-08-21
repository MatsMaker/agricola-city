import * as _ from "lodash";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { MAP_OBJECT, MAP_OBJECT_TYPE } from "../../types/MapEntities";
import { Texture, Point } from "pixi.js";
import CityLand from "../../entities/CityLand.entity";
import CityBuild from "../../entities/CityBuild.entity";
import { IConfigState } from "../../core/config/Config.reducer";

class CityCore {
	public terrain: MAP_OBJECT[][] = [];
	public objects: MAP_OBJECT[][] = [];

	protected config: IConfigState;
	protected assetsLoader: AssetsLoader;

	constructor(config: IConfigState, assetsLoader: AssetsLoader) {
		this.config = config;
		this.assetsLoader = assetsLoader;
	}

	public init(): void {
		this.fillTerrainData();
		this.fillObjectsData();
	}

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
		const grasTextures = this.assetsLoader.getResource("img/grass").textures;
		const grasTexturesKeys = Object.keys(grasTextures);

		this.terrain = this.createGreed();
		this.forEachPoints((x, y) => {
			const randomLandTexture =
				grasTexturesKeys[_.random(0, grasTexturesKeys.length - 1)];
			this.terrain[y][x] = new CityLand(
				x,
				y,
				grasTextures[randomLandTexture],
				MAP_OBJECT_TYPE.LAND
			);
		});
	}

	protected fillObjectsData(): void {
		const { startCityData } = this.config;

		this.objects = this.createGreed();
		this.forEachPoints((x, y) => {
			const pointData = startCityData.find((d) => d.x === x && d.y === y); // TODO need extend for set big size objects
			if (pointData) {
				const build = new CityBuild(
					x,
					y,
					this.getTextureByObjectType(pointData.type),
					pointData.type
				);
				for (let i = 0; i < build.size; i++) {
					for (let j = 0; j < build.size; j++) {
						this.objects[y + i][x + j] = build;
					}
				}
			}
		});
	}

	public newBuild = (type: MAP_OBJECT_TYPE, coordinate: Point): CityBuild => {
		const { x, y } = coordinate;
		const build = new CityBuild(x, y, this.getTextureByObjectType(type), type);
		this.objects[y][x] = build;
		return build;
	};

	protected getTextureByObjectType(type: MAP_OBJECT_TYPE): Texture {
		let fileName: string;
		switch (type) {
			case MAP_OBJECT_TYPE.HOME:
				fileName = "img/house-2-02";
				break;
			case MAP_OBJECT_TYPE.SENAT:
				fileName = "img/Senat_02";
			default:
				break;
		}
		return this.assetsLoader.getResource(fileName).texture;
	}
}

export default CityCore;
