import { Container, Point, Sprite } from 'pixi.js';
import { injectable, inject } from 'inversify';
import TYPES from '../../types/MainConfig';
import Config from '../../core/config/Config';
import AssetsLoader from '../../core/assetsLoader/AssetsLoader';
import { StoreType } from 'store';
import { onEvent } from '../../utils/store.subscribe';
import ViewPort from '../../core/viewPort/ViewPort';
import { BuildActionRequest, CityActionTypePayload } from './types';
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

	protected renderContent = () => {
		this.cityEntity.init();

		this.drawMap(
			this.cityEntity.terrain,
			this.drawStart.x,
			this.drawStart.y
		)((position: Point, data: MAP_OBJECT) => {
			const tile = this.isoTile(data, position.x, position.y);
			this.cityTerrains.push({
				sprite: tile,
				entity: data,
			})
			this.container.addChild(tile);
		})

		this.drawMap(
			this.cityEntity.objects,
			this.drawStart.x,
			this.drawStart.y
		)((position: Point, data: MAP_OBJECT, coordinate: Point) => {
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
		});

		this.reRender();
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

	protected drawMap = (items: MAP_OBJECT[][], xOffset: number, yOffset: number) => {
		let x, y, isoX, isoY;
		return (fn: (position: Point, data: MAP_OBJECT, coordinate: Point) => void) => {
				for (let i = 0, iL = items.length; i < iL; i++) {
					for (let j = 0, jL = items[i].length; j < jL; j++) {
							// cartesian 2D coordinate
							x = j * this.tileWidth;
							y = i * this.tileHeight;

							// iso coordinate
							isoX = x - y;
							isoY = (x + y) / 2;

							const data = items[i][j];
							const position = new Point(isoX + xOffset, isoY + yOffset);
							const coordinate = new Point(j, i)
							fn(position, data, coordinate);
					}
			}
		}
	}

	protected build(store: StoreType, payload: CityActionTypePayload<BuildActionRequest>): void {
		console.log('build', store, payload);
	}

}

export default CityContainer;
