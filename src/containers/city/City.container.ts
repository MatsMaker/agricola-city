import { Container, Point, Sprite } from "pixi.js";
import { injectable, inject } from "inversify";
import TYPES from "../../types/MainConfig";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import { onEvent } from "../../utils/store.subscribe";
import ViewPort from "../../core/viewPort/ViewPort";
import { DrawCb } from "./types";
import {
  IBaseMapObject,
  IViewObject,
  MAP_OBJECT_TYPE,
} from "../../types/MapEntities";
import {
  BUILD_REQUEST,
  RE_RENDER_CITY,
  INIT_CITY,
  RESET_CITY,
  requestCompletedAction,
  CITY_MAN_REACHED,
} from "../../core/city/action";
import { ActionType } from "../../types/actions";
import * as _ from "lodash";
import { IBuildActionRequest } from "../../core/city/types";
import ObjectsGenerator from "../objectsGenerator/ObjectsGenerator.container";
import CityGridContainer from "./CityGrid.container";
import CityRoad from "../objectsGenerator/CityRoad.entity";

export interface CityItem {
  sprite: Sprite;
  entity: IViewObject;
  coordinate: Point;
  zIndex?: number;
}

export interface MapPoint {
  x: number;
  y: number;
}

@injectable()
class CityContainer {
  protected store: StoreType;
  protected objectsGenerator: ObjectsGenerator;
  protected assetsLoader: AssetsLoader;
  protected viewPort: ViewPort;

  protected cityGridContainer: CityGridContainer;

  protected cityTerrains: CityItem[] = [];
  protected cityObjects: CityItem[] = [];

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
    this.init();
  }

  get view(): Container {
    return this.cityGridContainer.view;
  }

  protected init = (): void => {
    this.initListeners();
  };

  protected reset = (): void => {
    this.cityTerrains.forEach((t: CityItem) => {
      this.view.removeChild(t.sprite);
    });
    this.cityObjects.forEach((o: CityItem) => {
      this.view.removeChild(o.sprite);
    });
    this.cityTerrains = [];
    this.cityObjects = [];
    this.render();
  };

  protected initListeners = (): void => {
    const { subscribe } = this.store;
    this.view.sortableChildren = true;
    subscribe(onEvent(INIT_CITY, this.render.bind(this)));
    subscribe(onEvent(RESET_CITY, this.reset.bind(this)));
    subscribe(onEvent(RE_RENDER_CITY, this.reRender.bind(this)));
    subscribe(onEvent(BUILD_REQUEST, this.buildRequest.bind(this)));
    subscribe(onEvent(CITY_MAN_REACHED, this.reRender.bind(this)));
  };

  protected renderContent = () => {
    const appState = this.store.getState();
    this.cityGridContainer.drawMap(appState.city.terrain, this.renderTerrain);
    this.cityGridContainer.drawMap(appState.city.objects, this.renderObject);
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
    this.view.addChild(tile);
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

    if (data.type === MAP_OBJECT_TYPE.ROAD) {
      this.updateAdjacentRoadTiles();
    }

    this.cityObjects.push({
      sprite: tile,
      entity: data,
      coordinate,
    });

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

  protected buildRequest(action: ActionType<IBuildActionRequest>): void {
    const { city } = this.store.getState();
    if (city.buildRequest) {
      const item: IBaseMapObject = {
        x: action.payload.coordinate.x,
        y: action.payload.coordinate.y,
        type: action.payload.type,
      };
      this.cityGridContainer.drawOne(
        item,
        action.payload.coordinate,
        this.renderObject
      );
    }
    if (!city.addManRequest) {
      // TODO need fix this ManContainer connection
      this.store.dispatch(requestCompletedAction());
    }
    this.updateAdjacentRoadTiles();
  }

  protected updateAdjacentRoadTiles = (): void => {
    this.cityObjects.forEach((cityItem: CityItem) => {
      // mapArea(3, (i, j) => { TODO need add optimization to not update all ROD sprite and change this mutable
      if (cityItem.entity.type === MAP_OBJECT_TYPE.ROAD) {
        const newTexture = this.objectsGenerator.getRoadMasksTypes(
          cityItem.coordinate
        );
        const newRoadEntity: IViewObject = new CityRoad(
          cityItem.entity.x,
          cityItem.entity.y,
          newTexture
        );
        cityItem.entity = newRoadEntity;
        const position = this.cityGridContainer.getPositionByCoordinate(
          cityItem.coordinate
        );
        cityItem.sprite.x = position.x + newRoadEntity.offsetX;
        cityItem.sprite.y = position.y + newRoadEntity.offsetY;

        cityItem.sprite.texture = newTexture;
      }
      // });
    });
  };

  protected sortByZIndex = (): void => {
    const { config } = this.store.getState();
    this.cityObjects.forEach((co: CityItem) => {
      let zIndex = 1;
      switch (co.entity.type) {
        case MAP_OBJECT_TYPE.LAND:
          zIndex = co.coordinate.y + co.coordinate.x;
          break;
        case MAP_OBJECT_TYPE.ROAD:
          zIndex = co.coordinate.y + co.coordinate.x + 100;
          break;
        case MAP_OBJECT_TYPE.ALTAR:
        case MAP_OBJECT_TYPE.HOME:
        case MAP_OBJECT_TYPE.SENATE: {
          const textureSize = config.buildsSizes[co.entity.type] - 1;
          zIndex = co.coordinate.y + co.coordinate.x + 200 + textureSize;
          break;
        }
        default:
          break;
      }
      co.sprite.zIndex = zIndex;
    });
  };
}

export default CityContainer;
