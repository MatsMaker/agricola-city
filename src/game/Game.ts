import { injectable, inject } from 'inversify';
import Config from '../core/config/Config';
import TYPES from '../types/MainConfig';
import AssetsLoader from '../core/assetsLoader/AssetsLoader';
import { StoreType } from 'store';
import { ASSETS_IS_LOADED } from '../core/assetsLoader/types';
import { onEvent } from '../utils/store.subscribe';
import { initStartGameAction } from '../stages/action';
import { removeLoader } from '../utils/loader';
import StartGameStage from '../stages/StartGame.stage';
import ViewPort from '../core/viewPort/ViewPort';
import { buildAction } from '../containers/city/action';
import { MAP_OBJECT_TYPE } from '../types/MapEntities';
import { Point } from 'pixi.js';

@injectable()
class Game {
	
	protected store: StoreType;
	protected config: Config;
	protected assetsLoader: AssetsLoader;
	protected startGameStage: StartGameStage;
	protected viewPort: ViewPort;

	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.Config) config: Config,
		@inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader,
		@inject(TYPES.ViewPort) viewPort: ViewPort,
		@inject(TYPES.StartGameStage) startGameStage: StartGameStage,
	) {
		this.store = store;
		this.config = config;
		this.assetsLoader = assetsLoader;
		this.viewPort = viewPort;
		this.startGameStage = startGameStage;

		this.initListeners();
	}

	protected initListeners(): void {
		const { subscribe } = this.store
		subscribe(onEvent(ASSETS_IS_LOADED, this.initStage))
	}

	protected initStage = (): void => {
		removeLoader();
		this.store.dispatch(initStartGameAction())


		setTimeout(() => { // TODO REMOVE IT NEED FOR DEBUG build method
			this.store.dispatch(buildAction({
				objectType: MAP_OBJECT_TYPE.HOME,
				coordinate: new Point(0, 9)
			}))
		}, 3000);

	}

	public launch(): void {
		this.assetsLoader.load()
	}

}

export default Game;