import { Container } from "inversify";
import TYPES from "./types/MainConfig";
import Game from "./game/Game";
import { store, StoreType } from "./store/index";
import AssetsLoader from "./core/assetsLoader/AssetsLoader";
import ViewPort from "./core/viewPort/ViewPort";
import { Application } from "pixi.js";
import StartGameStage from "./stages/StartGame.stage";
import CityContainer from "./containers/city/City.container";
import CityCore from "./core/city/city.core";
import app from "./app";
import ObjectsGenerator from './containers/objectsGenerator/ObjectsGenerator.container';
import MainBarContainer from "./containers/mainBar/MainBar.container";
import CityManContainer from "./containers/city/CityMan.container";
import CityGridContainer from './containers/city/CityGrid.container';

const main = new Container({ defaultScope: "Singleton" });


main.bind<AssetsLoader>(TYPES.AssetsLoader).to(AssetsLoader);
main.bind<StoreType>(TYPES.Store).toConstantValue(store);
main.bind<ObjectsGenerator>(TYPES.ObjectsGenerator).to(ObjectsGenerator);
main.bind<Application>(TYPES.Application).toConstantValue(app);
main.bind<MainBarContainer>(TYPES.MainBarContainer).to(MainBarContainer);
main.bind<CityCore>(TYPES.CityCore).to(CityCore);
main.bind<CityGridContainer>(TYPES.CityGridContainer).to(CityGridContainer);
main.bind<CityManContainer>(TYPES.CityManContainer).to(CityManContainer);
main.bind<CityContainer>(TYPES.CityContainer).to(CityContainer);
main.bind<StartGameStage>(TYPES.StartGameStage).to(StartGameStage);
main.bind<ViewPort>(TYPES.ViewPort).to(ViewPort);
main.bind<Game>(TYPES.Game).to(Game);

export { main };
