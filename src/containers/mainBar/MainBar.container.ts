import { injectable, inject } from "inversify";
import { Container, Point } from "pixi.js";
import ViewPort from "../../core/viewPort/ViewPort";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import TYPES from "../../types/MainConfig";
import { MAP_OBJECT_TYPE } from "../../types/MapEntities";
import { RENDER_CITY, RE_RENDER_CITY } from "../../core/city/action";
import { onEvent } from "../../utils/store.subscribe";
import ObjectsGenerator, {
	Item,
} from "../objectsGenerator/ObjectsGenerator.container";

@injectable()
class MainBarContainer {
	protected store: StoreType;
	protected assetsLoader: AssetsLoader;
	protected viewPort: ViewPort;
	protected objectsGenerator: ObjectsGenerator;
	protected container: Container;
	protected buttons: Map<string, Item> = new Map();

	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader,
		@inject(TYPES.ViewPort) viewPort: ViewPort,
		@inject(TYPES.ObjectsGenerator) objectsGenerator: ObjectsGenerator
	) {
		this.store = store;
		this.assetsLoader = assetsLoader;
		this.viewPort = viewPort;
		this.objectsGenerator = objectsGenerator;
		this.init();
	}

	get view(): Container {
		return this.container;
	}

	protected initListeners = (): void => {
		const { subscribe } = this.store;
		subscribe(onEvent(RENDER_CITY, this.render.bind(this)));
		subscribe(onEvent(RE_RENDER_CITY, this.reRender.bind(this)));
	};

	protected renderContent(): void {
		const { viewPort } = this.store.getState();

		const menuBottomLine = viewPort.height;
		const menuMarginLeft = 64;
		const menuPosition = new Point(menuMarginLeft, menuBottomLine);
		const item = this.objectsGenerator.creteItem({
			x: menuPosition.x,
			y: menuPosition.y,
			type: MAP_OBJECT_TYPE.HOME,
		});
		this.buttons.set(MAP_OBJECT_TYPE.HOME, item);
		this.container.addChild(item.sprite);
	}

	protected render(): void {
		this.viewPort.addTickOnce(() => {
			this.renderContent();
			const { scene } = this.viewPort;
			scene.addChild(this.view);
			this.container.visible = true;
		});
	}

	protected reRender(): void {
		this.viewPort.addTickOnce(() => { });
	}

	protected init = (): void => {
		this.initContainer();
		this.initListeners();
	};

	protected initContainer = () => {
		this.container = new Container();
		this.container.visible = false;
		this.container.name = "MainBar";
	};
}

export default MainBarContainer;
