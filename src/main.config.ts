import { Container } from "inversify";
import * as settings from "./settings.json";
import TYPES from "./types/MainConfig";
import Config from "./core/config/Config";
import Game from "./game/Game";
import { store, StoreType } from "./store/index";
import AssetsLoader from "./core/assetsLoader/AssetsLoader";
import ViewPort from "./core/viewPort/ViewPort";
import { Application } from "pixi.js";
import StartGameStage from "./stages/StartGame.stage";
import BackgroundContainer from "./containers/background/Background.container";
import CityContainer from "./containers/city/City.container";

const main = new Container({ defaultScope: "Singleton" });
main.bind<Config>(TYPES.Config).toConstantValue(new Config(settings));
main.bind<AssetsLoader>(TYPES.AssetsLoader).to(AssetsLoader);
main.bind<StoreType>(TYPES.Store).toConstantValue(store);
main.bind<Application>(TYPES.Application).toConstantValue(
	new Application({
		width: window.innerWidth,
		height: window.innerHeight,
		antialias: true,
		transparent: true,
		resolution: 1,
	})
);
main
	.bind<BackgroundContainer>(TYPES.BackgroundContainer)
	.to(BackgroundContainer);
main.bind<CityContainer>(TYPES.CityContainer).to(CityContainer);
main.bind<StartGameStage>(TYPES.StartGameStage).to(StartGameStage);
main.bind<ViewPort>(TYPES.ViewPort).to(ViewPort);
main.bind<Game>(TYPES.Game).to(Game);

export default main;
