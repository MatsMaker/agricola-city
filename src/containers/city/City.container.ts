import { Container, Point, Sprite } from 'pixi.js';
import { injectable, inject } from 'inversify';
import TYPES from '../../types/MainConfig';
import Config from '../../core/config/Config';
import AssetsLoader from '../../core/assetsLoader/AssetsLoader';
import { StoreType } from 'store';
import { onEvent } from '../../utils/store.subscribe';
import ViewPort from '../../core/viewPort/ViewPort';
import { BuildActionRequest, CityActionTypePayload, DrawCb } from './types';
import CityEntity from '../../entities/City.entity';
import { MAP_OBJECT } from '../../types/MapEntities';
import CityBuild from '../../entities/CityBuild.entity';
import { BUILD, RENDER_CITY, RE_RENDER_CITY } from './action';


export interface ContainerObject {
	sprite: Sprite
	entity: MAP_OBJECT
}

@injectable()
class CityContainer {


	protected store: StoreType;
	protected config: Config;
	protected assetsLoader: AssetsLoader;
	protected viewPort: ViewPort;
	protected container: Container;
	protected cityEntity: CityEntity;

	protected cityTerrains: ContainerObject[] = [];
	protected cityObjects: ContainerObject[] = [];

	public tileHeight: number = 26;
	public tileWidth: number = 26;
	public drawStart: Point;


	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.Config) config: Config,
		@inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader,
		@inject(TYPES.ViewPort) viewPort: ViewPort
	) {
		this.store = store;
		this.config = config;
		this.assetsLoader = assetsLoader;
		this.viewPort = viewPort;
		this.init();
	}

	get view(): Container {
		return this.container;
	}

	protected init = (): void => {
		this.initContainer();
		this.initListeners();
		this.initCity();

		this.drawStart = new Point(this.viewPort.getState().centerWidth - this.tileWidth, this.tileHeight);
	}

	protected initContainer = () => {
		this.container = new Container();
		this.container.visible = false;
		this.container.name = 'city';
	}

	protected initListeners = (): void => {
		const { subscribe } = this.store
		subscribe(onEvent(RENDER_CITY, this.render.bind(this)))
		subscribe(onEvent(RE_RENDER_CITY, this.reRender.bind(this)))
		subscribe(onEvent(BUILD, this.build.bind(this)))
	}

	protected initCity = (): void => {
		this.cityEntity = new CityEntity(this.config, this.assetsLoader)
	}


	protected drawMap = (items: MAP_OBJECT[][], fn: (drawData: DrawCb) => void) => {
		let x, y, isoX, isoY;
		for (let i = 0, iL = items.length; i < iL; i++) {
			for (let j = 0, jL = items[i].length; j < jL; j++) {
					// cartesian 2D coordinate
					x = j * this.tileWidth;
					y = i * this.tileHeight;

					// iso coordinate
					isoX = x - y + this.drawStart.x
					isoY = (x + y) / 2 + this.drawStart.y

					const data = items[i][j];
					const position = new Point(isoX, isoY);
					const coordinate = new Point(j, i)
					fn({ position, data, coordinate });
			}
		}
	}

	protected drawOne = (item: MAP_OBJECT, coordinate: Point, fn: (drawData: DrawCb) => void) => {
			// cartesian 2D coordinate
			const x = coordinate.x * this.tileWidth;
			const y = coordinate.y * this.tileHeight;

			// iso coordinate
			const isoX = x - y + this.drawStart.x
			const isoY = (x + y) / 2 + this.drawStart.y

			const position = new Point(isoX, isoY)
			const data = item;
			fn({ position, data, coordinate });
	}

	protected renderContent = () => {
		this.cityEntity.init();

		this.drawMap(
			this.cityEntity.terrain, 
			this.renderTerrain
		)

		this.drawMap(
			this.cityEntity.objects,
			this.renderObject
		);

		this.reRender();
	}

	protected renderTerrain = (drawData: DrawCb) => {
		const { position, data } = drawData
		const tile = this.isoTile(data, position.x, position.y);
		this.cityTerrains.push({
			sprite: tile,
			entity: data,
		})
		this.container.addChild(tile);
	}

	protected renderObject = (drawData: DrawCb) => {
		const { position, data, coordinate } = drawData
		if (data && data instanceof CityBuild) {
			const isAnchorCoordinate = data.x === coordinate.x && data.y === coordinate.y;
			if (!isAnchorCoordinate) { return; }

			const tile = this.isoTile(data, position.x, position.y);
			this.cityObjects.push({
				sprite: tile,
				entity: data,
			})
			this.container.addChild(tile);
		}
	}

	protected render(): void {
		this.viewPort.addTickOnce(() => {
			this.renderContent();
			const { scene } = this.viewPort
			scene.addChild(this.view)
			this.container.visible = true;
		})
	}

	protected reRender(): void {
		this.viewPort.addTickOnce(() => {

		})
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

	protected build(store: StoreType, payload: CityActionTypePayload<BuildActionRequest>): void {
		console.log('build', store, payload); // TODO need make more clear to got instance of newBuild

		const build = this.cityEntity.newBuild(payload.payload.objectType, payload.payload.coordinate);
		this.drawOne(
			build,
			payload.payload.coordinate,
			this.renderObject
		)
	}

}

export default CityContainer;
