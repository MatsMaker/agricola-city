import { Container, Point } from "pixi.js";
import { injectable, inject } from "inversify";
import TYPES from "../../types/MainConfig";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import { onEvent } from "../../utils/store.subscribe";
import ViewPort from "../../core/viewPort/ViewPort";
import { DrawCb } from "./types";
import { IBaseMapObject } from "../../types/MapEntities";
import { RE_RENDER_CITY, INIT_CITY, RESET_CITY, onTerrainClickAction } from "../../core/city/action";
import * as _ from "lodash";
import ObjectsGenerator from "../objectsGenerator/ObjectsGenerator.container";

@injectable()
class CityGridContainer {
	protected store: StoreType;
	protected objectsGenerator: ObjectsGenerator;
	protected assetsLoader: AssetsLoader;
	protected viewPort: ViewPort;

	public container: Container;

	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.ObjectsGenerator) objectsGenerator: ObjectsGenerator,
		@inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader,
		@inject(TYPES.ViewPort) viewPort: ViewPort
	) {
		this.store = store;
		this.objectsGenerator = objectsGenerator;
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
	};

	protected resetCity = (): void => {
		this.render();
	};

	protected initContainer = () => {
		this.container = new Container();
		this.container.visible = false;
		this.container.name = "CityGrid";

		const { scene } = this.viewPort;
		scene.addChild(this.view);
	};

	protected initListeners = (): void => {
		const { subscribe } = this.store;
		subscribe(onEvent(INIT_CITY, this.render.bind(this)));
		subscribe(onEvent(RESET_CITY, this.resetCity.bind(this)));
		subscribe(onEvent(RE_RENDER_CITY, this.reRender.bind(this)));
	};

	public drawMap = (
		items: IBaseMapObject[][],
		fn: (drawData: DrawCb) => void
	) => {
		const { tileWidth, tileHeight, distortionFactor } =
			this.store.getState().config.citySize;
		const { centerWidth } = this.viewPort.getState();

		const drawStart: Point = new Point(centerWidth - tileWidth, tileHeight);

		let x, y, isoX, isoY;
		for (let i = 0, iL = items.length; i < iL; i++) {
			for (let j = 0, jL = items[i].length; j < jL; j++) {
				if (!items[i][j]) continue;
				// cartesian 2D coordinate
				x = j * tileWidth;
				y = i * tileHeight;

				// iso coordinate
				isoX = x - y + drawStart.x;
				isoY = (x + y) / distortionFactor + drawStart.y;

				const data = this.objectsGenerator.createMapObject(items[i][j]);
				const position = new Point(isoX, isoY);
				const coordinate = new Point(j, i);
				fn({ position, data, coordinate });
			}
		}
	};

	public drawOne = (
		item: IBaseMapObject,
		coordinate: Point,
		fn: (drawData: DrawCb) => void
	) => {
		const { tileWidth, tileHeight } = this.store.getState().config.citySize;
		const { centerWidth } = this.viewPort.getState();

		const drawStart: Point = new Point(centerWidth - tileWidth, tileHeight);

		// cartesian 2D coordinate
		const x = coordinate.x * tileWidth;
		const y = coordinate.y * tileHeight;

		// iso coordinate
		const isoX = x - y + drawStart.x;
		const isoY = (x + y) / 2 + drawStart.y;

		const position = new Point(isoX, isoY);
		const data = this.objectsGenerator.createMapObject(item);
		fn({ position, data, coordinate });
	};

	protected render(): void {
		this.viewPort.addTickOnce(() => {
			this.container.visible = true;
			this.container.interactive = true;
			this.container.on("pointerdown", this.onTerrainClick);
			this.container.visible = true;
		});
	}

	protected onTerrainClick = (e: any) => {
		const position = this.getIso(e.data.global);
		const coordinate = this.getMapCoordinate(position);

		this.store.dispatch(
			onTerrainClickAction({
				position,
				coordinate,
			})
		);
	};

	protected reRender(): void {
		this.viewPort.addTickOnce(() => { });
	}

	public getIso = (absolutePoint: Point): Point => {
		const { width, height, tileWidth, tileHeight, distortionFactor } =
			this.store.getState().config.citySize;
		const { centerWidth } = this.viewPort.getState();

		const cityWeight = tileWidth * width;
		const cityHeight = tileHeight * height;
		const RB1Size = width * tileWidth;

		const R = new Point(centerWidth, (height * tileHeight) / distortionFactor);
		const A1 = new Point(R.x, R.y - cityHeight / distortionFactor);
		const B1 = new Point(centerWidth + RB1Size, R.y);
		const D1 = new Point(R.x - cityWeight, R.y);
		const RA1Size = R.y;
		const A1C1Size = RA1Size * 2;
		const D1B1Size = RB1Size * 2;

		const correlationX = D1B1Size / cityWeight;
		const correlationY = A1C1Size / (cityHeight / distortionFactor);

		const isoX =
			CityGridContainer.distancePointToLIne(D1, A1, absolutePoint) /
			correlationX;
		const isoY =
			CityGridContainer.distancePointToLIne(A1, B1, absolutePoint) /
			correlationY;

		return new Point(isoX, isoY);
	};

	public getMapCoordinate = (position: Point): Point => {
		const { tileHeight } = this.store.getState().config.citySize;

		const x = Math.trunc(position.x / tileHeight);
		const y = Math.trunc(position.y / tileHeight);
		return new Point(x, y);
	};

	static distancePointToLIne = (X1: Point, X2: Point, P0: Point): number => {
		return (
			Math.abs(
				(X2.y - X1.y) * P0.x - (X2.x - X1.x) * P0.y + X2.x * X1.y - X2.y * X1.x
			) / Math.sqrt(Math.pow(X2.y - X1.y, 2) + (X2.x - X1.x, 2))
		);
	};
}

export default CityGridContainer;
