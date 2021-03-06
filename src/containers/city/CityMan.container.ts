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
import {
	BUILD_REQUEST,
	cityManReducedAction,
	CITY_MAN_REACHED,
	INIT_CITY,
	requestCompletedAction,
	RESET_CITY,
} from "../../core/city/action";
import { onEvent } from "../../utils/store.subscribe";
import CityManItem from "./CityMan.item";
import { ICityManReduced } from "core/city/types";
import { uid } from "uid";

@injectable()
class CityManContainer {
	protected store: StoreType;
	protected objectsGenerator: ObjectsGenerator;
	protected assetsLoader: AssetsLoader;
	protected viewPort: ViewPort;

	protected cityGridContainer: CityGridContainer;
	protected cityMans: CityManItem[] = [];

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
		subscribe(onEvent(INIT_CITY, this.render.bind(this)));
		subscribe(onEvent(RESET_CITY, this.reset.bind(this)));
		subscribe(onEvent(BUILD_REQUEST, this.addManOnBuildRequest.bind(this)));
		subscribe(onEvent(CITY_MAN_REACHED, this.cityManReached.bind(this)));
		subscribe(onEvent(CITY_MAN_REACHED, this.reRender.bind(this)));
	};

	public renderContent = () => {
		const appState = this.store.getState();
		appState.city.mans.forEach((d: IBaseMapObject) => {
			this.cityGridContainer.drawOne(d, new Point(d.x, d.y), this.renderMan);
		});
	};

	protected renderMan = (drawData: DrawCb) => {
		const { data, coordinate } = drawData;
		const tile = this.objectsGenerator.renderMan(drawData);
		tile.name = `cityContainer/cityTerrains/${data.type}`;
		const cityManItem: CityManItem = new CityManItem({
			sprite: tile,
			entity: data,
			coordinate,
		});
		cityManItem.lookAround = this.getCityRodMap;
		cityManItem.onMoved = this.cityManMoved;
		cityManItem.getPositionByCoordinate =
			this.cityGridContainer.getPositionByCoordinate;
		cityManItem.startMoveToNextPoint();

		this.cityMans.push(cityManItem);
		this.view.addChild(tile);
	};

	protected render(): void {
		this.viewPort.addTickOnce(() => {
			this.renderContent();
		});
	}

	protected reRender(): void {
		this.viewPort.addTickOnce(() => {
			this.sortByZIndex();
		});
	}

	protected reset(): void {
		this.cityMans.forEach((m: CityItem) => {
			this.view.removeChild(m.sprite);
		});
		this.cityMans = [];
		this.render();
	}

	protected addManOnBuildRequest(): void {
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
				uid: uid(),
			};
			this.cityGridContainer.drawOne(manItem, cp, this.renderMan);
			this.store.dispatch(requestCompletedAction());
		}
	}

	protected cityManMoved = (data: ICityManReduced): void => {
		this.store.dispatch(cityManReducedAction(data));
	};

	protected cityManReached = () => {
		const state = this.store.getState();
		const manUid = state.lastAction.payload.entity.uid;
		const theMan = this.cityMans.find(
			(m: CityManItem) => m.entity.uid === manUid
		);
		if (theMan) {
			theMan.startMoveToNextPoint();
		} else {
			console.warn("do not found man by uid");
		}
	};

	public getCityRodMap = () => {
		const { city } = this.store.getState();
		return city.objects;
	};

	protected sortByZIndex = (): void => {
		this.cityMans.forEach((co: CityManItem) => {
			const zIndex = co.coordinate.y + co.coordinate.x + 200;
			co.sprite.zIndex = zIndex;
		});
	};
}

export default CityManContainer;
