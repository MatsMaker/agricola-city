import { injectable, inject } from "inversify";
import { Container, Point } from "pixi.js";
import ViewPort from "../../core/viewPort/ViewPort";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import TYPES from "../../types/MainConfig";
import { MAP_OBJECT_TYPE } from "../../types/MapEntities";
import { onEvent } from "../../utils/store.subscribe";
import ObjectsGenerator, { Item } from "../../core/ObjectsGenerator.container";
import { forEach } from "lodash";
import { INIT_MAIN_MENU, mainBarButtonClickAction } from "./action";
import { BUTTONS_TYPE } from "./type";

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
		subscribe(onEvent(INIT_MAIN_MENU, this.render.bind(this)));
	};

	protected renderContent(): void {
		const { viewPort } = this.store.getState();

		const menuBottomLine = viewPort.height;
		const menuMarginLeft = 96;
		const menuPosition = new Point(32, menuBottomLine);
		const buttonsKeys: MAP_OBJECT_TYPE[] = [
			MAP_OBJECT_TYPE.BUTTON_ROAD,
			MAP_OBJECT_TYPE.BUTTON_HOME,
			MAP_OBJECT_TYPE.BUTTON_SENATE,
			MAP_OBJECT_TYPE.BUTTON_OFF,
		];
		forEach(buttonsKeys, (type: MAP_OBJECT_TYPE, i: number) => {
			const item = this.objectsGenerator.creteItem({
				x: menuPosition.x + menuMarginLeft * i,
				y: menuPosition.y,
				type: type,
			});
			this.buttons.set(type, item);
			item.sprite.interactive = true;
			item.sprite.name = type;
			item.sprite.on("pointerdown", () => {
				let buttonType: BUTTONS_TYPE;
				switch (type) {
					case MAP_OBJECT_TYPE.BUTTON_ROAD:
						buttonType = BUTTONS_TYPE.ROAD;
						break;
					case MAP_OBJECT_TYPE.BUTTON_HOME:
						buttonType = BUTTONS_TYPE.HOME;
						break;
					case MAP_OBJECT_TYPE.BUTTON_SENATE:
						buttonType = BUTTONS_TYPE.SENATE;
						break;
					case MAP_OBJECT_TYPE.BUTTON_OFF:
						buttonType = BUTTONS_TYPE.RESET;
						break;

					default:
						break;
				}
				this.store.dispatch(
					mainBarButtonClickAction({
						buttonType,
					})
				);
			});
			this.container.addChild(item.sprite);
		});
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
