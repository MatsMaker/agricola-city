import { Container, Point, Sprite, Texture } from 'pixi.js';
import { injectable, inject } from 'inversify';
import TYPES from '../../types/MainConfig';
import Config from '../../core/config/Config';
import AssetsLoader from '../../core/assetsLoader/AssetsLoader';
import { StoreType } from 'store';
import { onEvent } from '../../utils/store.subscribe';
import ViewPort from '../../core/viewPort/ViewPort';
import { RENDER_CITY, RE_RENDER_CITY } from './types';
import CityEntity from '../../entities/City.entity';
import { MAP_OBJECT } from '../../types/MapEntities';


@injectable()
class CityContainer {


	protected store: StoreType;
	protected config: Config;
	protected assetsLoader: AssetsLoader;
	protected viewPort: ViewPort;
	protected container: Container;
	protected cityEntity: CityEntity;

	public tileHeight: number = 26;
	public tileWidth: number = 26;
	public tileScale: number = 0.32;


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
	}

	protected initCity = (): void => {
		this.cityEntity = new CityEntity(this.config, this.assetsLoader);
	}

	protected renderContent = () => {
		this.cityEntity.fillData();

		this.drawMap(
			this.cityEntity.terrain,
			this.viewPort.getState().centerWidth - this.tileWidth,
			this.tileHeight
		)((position: Point, data: MAP_OBJECT) => {
			const drawTile = this.isoTile(data.texture);
			drawTile(position.x, position.y);
		})
		this.reRender();
	}

	protected render(): void {
		this.viewPort.addTickOnce(() => {
			this.renderContent();
			this.container.visible = true;
		})
	}

	protected reRender(): void {
		this.viewPort.addTickOnce(() => {
			// const { viewPort } = this.store.getState();
		})
	}

	protected isoTile = (texture: Texture) => {
		return (x: number, y: number) => {
			const tile = new Sprite(texture);
			tile.position.x = x;
			tile.position.y = y;

			// bottom-left
			tile.anchor.x = 0;
			tile.anchor.y = 1;
			tile.scale.set(this.tileScale, this.tileScale);

			this.container.addChild(tile);
		}
	}

	protected drawMap = (terrain: MAP_OBJECT[][], xOffset: number, yOffset: number) => {
		let x, y, isoX, isoY;
		return (fn: (coordinate: Point, data: MAP_OBJECT) => void) => {
				for (let i = 0, iL = terrain.length; i < iL; i++) {
					for (let j = 0, jL = terrain[i].length; j < jL; j++) {
							// cartesian 2D coordinate
							x = j * this.tileWidth;
							y = i * this.tileHeight;

							// iso coordinate
							isoX = x - y;
							isoY = (x + y) / 2;

							const data = terrain[i][j];
							const position = new Point(isoX + xOffset, isoY + yOffset);
							fn(position, data);
					}
			}
		}
	}

}

export default CityContainer;
