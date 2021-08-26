import { injectable, inject } from "inversify";
import TYPES from "../types/MainConfig";
import { StoreType } from "../store";
import ViewPort from "../core/viewPort/ViewPort";
import { onEvent } from "../utils/store.subscribe";
import {
	initiatedStartGameAction,
	INIT_START_GAME_STAGE,
	RESET_GAME_STAGE,
} from "./action";
import CityContainer from "../containers/city/City.container";
import { VIEW_PORT_RESIZE_ACTION } from "../core/viewPort/actions";
import {
	initCity,
	reRenderCityAction,
	resetCity,
} from "../core/city/action";
import MainBarContainer from "../containers/mainBar/MainBar.container";
import { initMainMenu } from '../containers/mainBar/action';
import CityGridContainer from '../containers/city/CityGrid.container';
import CityManContainer from "../containers/city/CityMan.container";

@injectable()
class StartGameStage {
	protected store: StoreType;
	protected viewPort: ViewPort;

	protected cityContainer: CityContainer;
	protected cityGridContainer: CityGridContainer;
	protected mainBarContainer: MainBarContainer;
	protected cityManContainer: CityManContainer;

	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.ViewPort) viewPort: ViewPort,
		@inject(TYPES.CityGridContainer) cityGridContainer: CityGridContainer,
		@inject(TYPES.CityManContainer) cityManContainer: CityManContainer,
		@inject(TYPES.CityContainer) cityContainer: CityContainer,
		@inject(TYPES.MainBarContainer) mainBarContainer: MainBarContainer
	) {
		this.store = store;
		this.viewPort = viewPort;
		this.cityGridContainer = cityGridContainer;
		this.cityContainer = cityContainer;
		this.cityManContainer = cityManContainer;
		this.mainBarContainer = mainBarContainer;
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

		dispatch(initCity());
		dispatch(initMainMenu());

		this.viewPort.addTickOnce(this.initiatedScreen.bind(this));
	}

	protected resetScreen() {
		const { dispatch } = this.store;

		dispatch(resetCity());
		this.viewPort.addTickOnce(this.initiatedScreen.bind(this));
	}

	protected initListeners(): void {
		const { subscribe, dispatch } = this.store;
		subscribe(
			onEvent(VIEW_PORT_RESIZE_ACTION, () => {
				dispatch(reRenderCityAction());
			})
		);
		subscribe(onEvent(INIT_START_GAME_STAGE, this.initScreen.bind(this)));
		subscribe(onEvent(RESET_GAME_STAGE, this.resetScreen.bind(this)));
	}
}

export default StartGameStage;
