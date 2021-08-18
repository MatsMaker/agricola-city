import * as _ from 'lodash';
import Config from '../core/config/Config';
import Land from './cityFrames/Land';
import AssetsLoader from '../core/assetsLoader/AssetsLoader';
import { MAP_OBJECT } from '../types/MapEntities';


class CityEntity {


	public terrain: MAP_OBJECT[][];
	protected config: Config;
	protected assetsLoader: AssetsLoader;


	constructor(
		config: Config,
		assetsLoader: AssetsLoader,
	) {
		this.config = config;
		this.assetsLoader = assetsLoader;
	}

	public fillData(): void {
		const citySize = this.config.getCitySize();
		// const cityData = this.config.getStartCityData();

		const grasTextures= this.assetsLoader.getResource('img/grass').textures;
		const grasTexturesKeys = Object.keys(grasTextures);

		const terrain: MAP_OBJECT[][] = [];

		for(let y: number = 0; y < citySize.width; y++) {
			for(let x: number = 0; x < citySize.width; x++) {
				if (!terrain[y]) { terrain[y] = []}

				const randomLandTexture = grasTexturesKeys[_.random(0, grasTexturesKeys.length - 1)];				
				terrain[y][x] = new Land(x, y, grasTextures[randomLandTexture] );

			}
		}
		this.terrain = terrain;
	}

}

export default CityEntity;