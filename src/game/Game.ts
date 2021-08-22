import { injectable, inject } from "inversify";
import TYPES from "../types/MainConfig";
import AssetsLoader from "../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import { ASSETS_IS_LOADED } from "../core/assetsLoader/types";
import { onEvent } from "../utils/store.subscribe";
import { initStartGameAction, resetGameAction } from "../stages/action";
import { removeLoader } from "../utils/loader";
import StartGameStage from "../stages/StartGame.stage";
import ViewPort from "../core/viewPort/ViewPort";
import { buildAction, ON_TERRAIN_CLICK } from "../core/city/action";
import { MAP_OBJECT_TYPE } from "../types/MapEntities";
import { IsoPoint } from "../containers/city/types";
import { ActionType } from "../types/actions";
import { BUTTON_MENU_CLICK } from "../containers/mainBar/action";
import { BUTTONS_TYPE, IMainMenuClick } from "../containers/mainBar/type";

@injectable()
class Game {
	protected store: StoreType;
	protected assetsLoader: AssetsLoader;
	protected startGameStage: StartGameStage;
	protected viewPort: ViewPort;

	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader,
		@inject(TYPES.ViewPort) viewPort: ViewPort,
		@inject(TYPES.StartGameStage) startGameStage: StartGameStage
	) {
		this.store = store;
		this.assetsLoader = assetsLoader;
		this.viewPort = viewPort;
		this.startGameStage = startGameStage;

		this.initListeners();
	}

	protected initListeners(): void {
		const { subscribe } = this.store;
		subscribe(onEvent(ASSETS_IS_LOADED, this.initStage));
		subscribe(onEvent(ON_TERRAIN_CLICK, this.requestToBuild));
		subscribe(onEvent(BUTTON_MENU_CLICK, this.onButtonMenuClick));
	}

	protected initStage = (): void => {
		removeLoader();
		this.store.dispatch(initStartGameAction());
	};

	public launch(): void {
		this.assetsLoader.load();
	}

	protected requestToBuild = (request: ActionType<IsoPoint>) => {
		const { mainMenu } = this.store.getState();

		let type: MAP_OBJECT_TYPE;
		switch (mainMenu.switcherActiveState) {
			case BUTTONS_TYPE.ROAD:
				type = MAP_OBJECT_TYPE.ROAD;
				break;
			case BUTTONS_TYPE.HOME:
				type = MAP_OBJECT_TYPE.HOME;
				break;
			case BUTTONS_TYPE.SENATE:
				type = MAP_OBJECT_TYPE.SENATE;
				break;

			default:
				break;
		}

		this.store.dispatch(
			buildAction({
				type,
				coordinate: request.payload.coordinate,
			})
		);
	};

	protected onButtonMenuClick = (action: ActionType<IMainMenuClick>) => {
		switch (action.payload.buttonType) {
			case BUTTONS_TYPE.RESET:
				this.store.dispatch(resetGameAction());
				break;

			default:
				break;
		}
	};
}

export default Game;
