import * as _ from "lodash";
import {
	IBaseMapObject,
	IViewObject,
	MAP_OBJECT_TYPE,
} from "../../types/MapEntities";
import { Point, Sprite, Texture } from "pixi.js";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { injectable } from "inversify";
import { inject } from "inversify";
import TYPES from "../../types/MainConfig";
import CityLand from "./CityLand.entity";
import CityRoad from "./CityRoad.entity";
import CityAltar from "./CityAltar.entity";
import CityHome from "./CityHome.entity";
import CitySenate from "./CitySenate.entity";
import { DrawBaseCb } from "../../containers/city/types";

export interface Item {
	sprite: Sprite;
	entity: IViewObject;
}
@injectable()
export default class ObjectsGenerator {
	protected assetsLoader: AssetsLoader;

	constructor(@inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader) {
		this.assetsLoader = assetsLoader;
	}

	public creteItem = (object: IBaseMapObject): Item => {
		const viewObject = this.createMapObject(object);
		const sprite = this.renderObject({
			position: new Point(object.x, object.y),
			data: viewObject,
		});
		return {
			sprite,
			entity: viewObject,
		};
	};

	public createMapObject = (object: IBaseMapObject): IViewObject => {
		let mapObject: IViewObject;

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

	public renderObject = (drawData: DrawBaseCb): Sprite => {
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

	public renderTerrain = (drawData: DrawBaseCb): Sprite => {
		const { position, data } = drawData;
		const tile = this.isoTile(data, position.x, position.y);
		return tile;
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

	protected isoTile(data: IViewObject, x: number, y: number): Sprite {
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