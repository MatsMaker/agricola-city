import { Container, Point, Sprite } from "pixi.js";
import { injectable, inject } from "inversify";
import TYPES from "../../types/MainConfig";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import { onEvent } from "../../utils/store.subscribe";
import ViewPort from "../../core/viewPort/ViewPort";
import { DrawCb } from "./types";
import { IBaseMapObject, IViewObject, MAP_OBJECT_TYPE } from "../../types/MapEntities";
import {
  BUILD_REQUEST,
  RE_RENDER_CITY,
  onTerrainClickAction,
  requestCompletedAction,
  INIT_CITY,
  RESET_CITY,
} from "../../core/city/action";
import { ActionType } from "../../types/actions";
import * as _ from "lodash";
import { IBuildActionRequest } from "../../core/city/types";
import ObjectsGenerator from "../../core/ObjectsGenerator.container";

export interface CityItem {
  sprite: Sprite;
  entity: IViewObject;
  coordinate: Point;
}

@injectable()
class CityContainer {
  protected store: StoreType;
  protected objectsGenerator: ObjectsGenerator;
  protected assetsLoader: AssetsLoader;
  protected viewPort: ViewPort;

  protected container: Container;

  protected cityTerrains: CityItem[] = [];
  protected cityObjects: CityItem[] = [];
  protected cityResides: CityItem[] = [];

  constructor(
    @inject(TYPES.Store) store: StoreType,
    @inject(TYPES.ObjectsGenerator) objectsGenerator: ObjectsGenerator,
    @inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader,
    @inject(TYPES.ViewPort) viewPort: ViewPort
  ) {
    this.store = store;
    this.objectsGenerator = objectsGenerator;
    this.assetsLoader = assetsLoader;
    this.viewPort = viewPort;
    this.init();
  }

  get view(): Container {
    return this.container;
  }

  protected init = (): void => {
    this.initContainer();
    this.initListeners();
  };

  protected resetCity = (): void => {
    this.container.removeChildren();
    this.render();
  };

  protected initContainer = () => {
    this.container = new Container();
    this.container.visible = false;
    this.container.name = "city";

    const { scene } = this.viewPort;
    scene.addChild(this.view);
  };

  protected initListeners = (): void => {
    const { subscribe } = this.store;
    subscribe(onEvent(INIT_CITY, this.render.bind(this)));
    subscribe(onEvent(RESET_CITY, this.resetCity.bind(this)));
    subscribe(onEvent(RE_RENDER_CITY, this.reRender.bind(this)));
    subscribe(onEvent(BUILD_REQUEST, this.buildRequest.bind(this)));
  };

  protected drawMap = (
    items: IBaseMapObject[][],
    fn: (drawData: DrawCb) => void
  ) => {
    const { tileWidth, tileHeight, distortionFactor } =
      this.store.getState().config.citySize;
    const { centerWidth } = this.viewPort.getState();

    const drawStart: Point = new Point(centerWidth - tileWidth, tileHeight);

    let x, y, isoX, isoY;
    for (let i = 0, iL = items.length; i < iL; i++) {
      for (let j = 0, jL = items[i].length; j < jL; j++) {
        if (!items[i][j]) continue;
        // cartesian 2D coordinate
        x = j * tileWidth;
        y = i * tileHeight;

        // iso coordinate
        isoX = x - y + drawStart.x;
        isoY = (x + y) / distortionFactor + drawStart.y;

        const data = this.objectsGenerator.createMapObject(items[i][j]);
        const position = new Point(isoX, isoY);
        const coordinate = new Point(j, i);
        fn({ position, data, coordinate });
      }
    }
  };

  protected drawOne = (
    item: IBaseMapObject,
    coordinate: Point,
    fn: (drawData: DrawCb) => void
  ) => {
    const { tileWidth, tileHeight } = this.store.getState().config.citySize;
    const { centerWidth } = this.viewPort.getState();

    const drawStart: Point = new Point(centerWidth - tileWidth, tileHeight);

    // cartesian 2D coordinate
    const x = coordinate.x * tileWidth;
    const y = coordinate.y * tileHeight;

    // iso coordinate
    const isoX = x - y + drawStart.x;
    const isoY = (x + y) / 2 + drawStart.y;

    const position = new Point(isoX, isoY);
    const data = this.objectsGenerator.createMapObject(item);
    fn({ position, data, coordinate });
  };

  protected renderContent = () => {
    const appState = this.store.getState();
    this.drawMap(appState.city.terrain, this.renderTerrain);
    this.drawMap(appState.city.objects, this.renderObject);

    appState.city.residents.forEach((d: IBaseMapObject) => {
      const item: IBaseMapObject = {
        x: d.x,
        y: d.y,
        type: d.type,
      };
      this.drawOne(item, new Point(d.x, d.y), this.renderResidents);
    });
  };

  protected onTerrainClick = (e: any) => {
    const position = this.getIso(e.data.global);
    const coordinate = this.getMapCoordinate(position);

    this.store.dispatch(
      onTerrainClickAction({
        position,
        coordinate,
      })
    );
  };

  protected renderTerrain = (drawData: DrawCb) => {
    const { data, coordinate } = drawData;
    const tile = this.objectsGenerator.renderTerrain(drawData);
    tile.name = `cityContainer/cityTerrains/${data.type}`;
    this.cityTerrains.push({
      sprite: tile,
      entity: data,
      coordinate,
    });
    this.container.addChild(tile);
  };

  protected renderResidents = (drawData: DrawCb) => {
    const { data, coordinate } = drawData;
    const tile = this.objectsGenerator.renderResident(drawData);
    tile.name = `cityContainer/cityTerrains/${data.type}`;
    this.cityResides.push({
      sprite: tile,
      entity: data,
      coordinate,
    });
    this.container.addChild(tile);
  };

  protected renderObject = (drawData: DrawCb) => {
    const { data, coordinate } = drawData;
    if (!data) return;
    const isAnchorCoordinate =
      data.x === coordinate.x && data.y === coordinate.y;
    if (!isAnchorCoordinate) {
      return;
    }
    const tile = this.objectsGenerator.renderObject(drawData);
    tile.name = `cityContainer/cityObjects/${data.type}`;
    this.cityObjects.push({
      sprite: tile,
      entity: data,
      coordinate,
    });
    this.container.addChild(tile);
  };

  protected render(): void {
    this.viewPort.addTickOnce(() => {
      this.renderContent();
      this.container.interactive = true;
      this.container.on("pointerdown", this.onTerrainClick);
      this.container.visible = true;
    });
  }

  protected reRender(): void {
    this.viewPort.addTickOnce(() => { });
  }

  protected buildRequest(action: ActionType<IBuildActionRequest>): void {
    const { city } = this.store.getState();
    if (city.buildRequest) {
      const item: IBaseMapObject = {
        x: action.payload.coordinate.x,
        y: action.payload.coordinate.y,
        type: action.payload.type,
      };
      this.drawOne(item, action.payload.coordinate, this.renderObject);
    }
    if (city.addManRequest) {
      const manItem: IBaseMapObject = {
        x: city.addManRequest.x,
        y: city.addManRequest.y,
        type: MAP_OBJECT_TYPE.MAN,
      };
      this.drawOne(manItem, new Point(
        city.addManRequest.x,
        city.addManRequest.y
      ), this.renderResidents);
    }
    this.store.dispatch(requestCompletedAction());
  }

  protected getIso = (absolutePoint: Point): Point => {
    const { width, height, tileWidth, tileHeight, distortionFactor } =
      this.store.getState().config.citySize;
    const { centerWidth } = this.viewPort.getState();

    const cityWeight = tileWidth * width;
    const cityHeight = tileHeight * height;
    const RB1Size = width * tileWidth;

    const R = new Point(centerWidth, (height * tileHeight) / distortionFactor);
    const A1 = new Point(R.x, R.y - cityHeight / distortionFactor);
    const B1 = new Point(centerWidth + RB1Size, R.y);
    const D1 = new Point(R.x - cityWeight, R.y);
    const RA1Size = R.y;
    const A1C1Size = RA1Size * 2;
    const D1B1Size = RB1Size * 2;

    const correlationX = D1B1Size / cityWeight;
    const correlationY = A1C1Size / (cityHeight / distortionFactor);

    const isoX =
      CityContainer.distancePointToLIne(D1, A1, absolutePoint) / correlationX;
    const isoY =
      CityContainer.distancePointToLIne(A1, B1, absolutePoint) / correlationY;

    return new Point(isoX, isoY);
  };

  protected getMapCoordinate = (position: Point): Point => {
    const { tileHeight } = this.store.getState().config.citySize;

    const x = Math.trunc(position.x / tileHeight);
    const y = Math.trunc(position.y / tileHeight);
    return new Point(x, y);
  };

  static distancePointToLIne = (X1: Point, X2: Point, P0: Point): number => {
    return (
      Math.abs(
        (X2.y - X1.y) * P0.x - (X2.x - X1.x) * P0.y + X2.x * X1.y - X2.y * X1.x
      ) / Math.sqrt(Math.pow(X2.y - X1.y, 2) + (X2.x - X1.x, 2))
    );
  };
}

export default CityContainer;
