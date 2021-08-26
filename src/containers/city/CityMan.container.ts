import { Container, Point } from "pixi.js";
import { injectable, inject } from "inversify";
import TYPES from "../../types/MainConfig";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import ViewPort from "../../core/viewPort/ViewPort";
import { DrawCb } from "./types";
import { IBaseMapObject, MAP_OBJECT_TYPE } from "../../types/MapEntities";
import * as _ from "lodash";
import ObjectsGenerator from "../objectsGenerator/ObjectsGenerator.container";
import { CityItem } from "./City.container";
import CityGridContainer from "./CityGrid.container";
import { BUILD_REQUEST } from "../../core/city/action";
import { onEvent } from "../../utils/store.subscribe";

@injectable()
class CityManContainer {
	protected store: StoreType;
	protected objectsGenerator: ObjectsGenerator;
	protected assetsLoader: AssetsLoader;
	protected viewPort: ViewPort;

	protected cityGridContainer: CityGridContainer;
	protected cityMans: CityItem[] = [];

	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.ObjectsGenerator) objectsGenerator: ObjectsGenerator,
		@inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader,
		@inject(TYPES.ViewPort) viewPort: ViewPort,
		@inject(TYPES.CityGridContainer) cityGridContainer: CityGridContainer
	) {
		this.store = store;
		this.objectsGenerator = objectsGenerator;
		this.assetsLoader = assetsLoader;
		this.viewPort = viewPort;
		this.cityGridContainer = cityGridContainer;
		this.initListeners();
	}

	get view(): Container {
		return this.cityGridContainer.view;
	}

	protected initListeners = (): void => {
		const { subscribe } = this.store;
		subscribe(onEvent(BUILD_REQUEST, this.addManOnBuildRequest.bind(this)));
	};

	public renderContent = () => {
		const appState = this.store.getState();
		appState.city.mans.forEach((d: IBaseMapObject) => {
			const item: IBaseMapObject = {
				x: d.x,
				y: d.y,
				type: d.type,
			};
			this.cityGridContainer.drawOne(item, new Point(d.x, d.y), this.renderMan);
		});
	};

	protected renderMan = (drawData: DrawCb) => {
		const { data, coordinate } = drawData;
		const tile = this.objectsGenerator.renderMan(drawData);
		tile.name = `cityContainer/cityTerrains/${data.type}`;
		this.cityMans.push({
			sprite: tile,
			entity: data,
			coordinate,
		});
		this.view.addChild(tile);
	};

	protected render(): void {
		this.viewPort.addTickOnce(() => { });
	}

	protected reRender(): void {
		this.viewPort.addTickOnce(() => { });
	}

	public reset(): void {
		this.cityMans.forEach((m: CityItem) => {
			this.view.removeChild(m.sprite);
		});
	}

	public addManOnBuildRequest(): void {
		const { city } = this.store.getState();
		if (city.addManRequest) {
			const cp: Point = new Point(
				city.addManRequest.coordinate.x,
				city.addManRequest.coordinate.y
			);
			const manItem: IBaseMapObject = {
				x: cp.x,
				y: cp.y,
				type: MAP_OBJECT_TYPE.MAN,
			};
			this.cityGridContainer.drawOne(manItem, cp, this.renderMan);
		}
	}
}

export default CityManContainer;
