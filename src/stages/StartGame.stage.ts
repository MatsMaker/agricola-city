import { injectable, inject } from "inversify";
// import BackgroundContainer from "../containers/background/Background.container";
import TYPES from "../types/MainConfig";
import { StoreType } from "../store";
// import {
// 	initBackgroundAction,
// 	reRenderBackgroundAction,
// } from "../containers/background/action";
import ViewPort from "../core/viewPort/ViewPort";
import { onEvent } from "../utils/store.subscribe";
import { initiatedStartGameAction, INIT_START_GAME_STAGE } from "./action";
import CityContainer from "../containers/city/City.container";
import { VIEW_PORT_RESIZE_ACTION } from "../core/viewPort/actions";
import {
	initCity,
	renderCityAction,
	reRenderCityAction,
} from "../core/city/action";

@injectable()
class StartGameStage {
	protected store: StoreType;
	protected viewPort: ViewPort;

	// protected backgroundContainer: BackgroundContainer;
	protected cityContainer: CityContainer;

	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.ViewPort) viewPort: ViewPort,
		// @inject(TYPES.BackgroundContainer) backgroundContainer: BackgroundContainer,
		@inject(TYPES.CityContainer) cityContainer: CityContainer
	) {
		this.store = store;
		this.viewPort = viewPort;
		// this.backgroundContainer = backgroundContainer;
		this.cityContainer = cityContainer;
		this.initListeners();
	}

	protected initiatedScreen() {
		const { dispatch } = this.store;
		this.viewPort.addTickOnce(() => {
			dispatch(initiatedStartGameAction());
		});
	}

	protected initScreen() {
		const { dispatch } = this.store;

		// dispatch(initBackgroundAction());
		dispatch(initCity());
		dispatch(renderCityAction());

		this.viewPort.addTickOnce(this.initiatedScreen.bind(this));
	}

	protected initListeners(): void {
		const { subscribe, dispatch } = this.store;
		subscribe(
			onEvent(VIEW_PORT_RESIZE_ACTION, () => {
				// dispatch(reRenderBackgroundAction());
				dispatch(reRenderCityAction());
			})
		);
		subscribe(onEvent(INIT_START_GAME_STAGE, this.initScreen.bind(this)));
	}
}

export default StartGameStage;
