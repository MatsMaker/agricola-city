import * as _ from "lodash";
import {
	IBaseMapObject,
	MAP_OBJECT,
	MAP_OBJECT_TYPE,
} from "../../types/MapEntities";
import { Sprite, Texture } from "pixi.js";
import { DrawCb } from "containers/city/types";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { injectable } from "inversify";
import { inject } from "inversify";
import TYPES from "../../types/MainConfig";
import CityLand from "../../entities/CityLand.entity";
import CityRoad from "../../entities/CityRoad.entity";
import CityAltar from "../../entities/CityAltar.entity";
import CityHome from "../../entities/CityHome.entity";
import CitySenate from "../../entities/CitySenate.entity";

@injectable()
export default class ObjectsGenerator {
	protected assetsLoader: AssetsLoader;

	constructor(@inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader) {
		this.assetsLoader = assetsLoader;
	}
	public renderObject = (drawData: DrawCb): Sprite => {
		const { position, data } = drawData;
		if (!data) return;
		let tile;
		switch (data.type) {
			case MAP_OBJECT_TYPE.ROAD:
			case MAP_OBJECT_TYPE.ALTAR:
			case MAP_OBJECT_TYPE.HOME:
			case MAP_OBJECT_TYPE.SENATE: {
				tile = this.isoTile(data, position.x, position.y);
				break;
			}

			default:
				break;
		}
		return tile;
	};

	public renderTerrain = (drawData: DrawCb): Sprite => {
		const { position, data } = drawData;
		const tile = this.isoTile(data, position.x, position.y);
		return tile;
	};

	public createMapObject = (object: IBaseMapObject): MAP_OBJECT => {
		let mapObject: MAP_OBJECT;

		switch (object.type) {
			case MAP_OBJECT_TYPE.LAND: {
				const grasTextures =
					this.assetsLoader.getResource("img/grass").textures;
				const grasTexturesKeys = Object.keys(grasTextures);
				const randomLandTexture =
					grasTexturesKeys[_.random(0, grasTexturesKeys.length - 1)];

				mapObject = new CityLand(
					object.x,
					object.y,
					grasTextures[randomLandTexture]
				);

				break;
			}

			case MAP_OBJECT_TYPE.ROAD: {
				const grasTextures = this.assetsLoader.getResource("img/road").textures;
				const grasTexturesKeys = Object.keys(grasTextures);
				const randomLandTexture =
					grasTexturesKeys[_.random(0, grasTexturesKeys.length - 1)];

				mapObject = new CityRoad(
					object.x,
					object.y,
					grasTextures[randomLandTexture]
				);

				break;
			}

			case MAP_OBJECT_TYPE.ALTAR: {
				mapObject = new CityAltar(
					object.x,
					object.y,
					this.getTextureByObjectType(object.type)
				);

				break;
			}

			case MAP_OBJECT_TYPE.HOME: {
				mapObject = new CityHome(
					object.x,
					object.y,
					this.getTextureByObjectType(object.type)
				);

				break;
			}

			case MAP_OBJECT_TYPE.SENATE: {
				mapObject = new CitySenate(
					object.x,
					object.y,
					this.getTextureByObjectType(object.type)
				);

				break;
			}

			default:
				break;
		}
		return mapObject;
	};

	protected getTextureByObjectType(type: MAP_OBJECT_TYPE): Texture {
		let fileName: string;
		switch (type) {
			case MAP_OBJECT_TYPE.ALTAR:
				fileName = "img/altar";
				break;
			case MAP_OBJECT_TYPE.HOME:
				fileName = "img/house-2-02";
				break;
			case MAP_OBJECT_TYPE.SENATE:
				fileName = "img/Senat_02";
			default:
				break;
		}
		return this.assetsLoader.getResource(fileName).texture;
	}

	protected isoTile(data: MAP_OBJECT, x: number, y: number): Sprite {
		const tile = new Sprite(data.texture);
		tile.position.x = x + data.offsetX;
		tile.position.y = y + data.offsetY;

		// bottom-left
		tile.anchor.x = data.anchor.x;
		tile.anchor.y = data.anchor.y;
		tile.scale.set(data.scale, data.scale);

		return tile;
	}
}
