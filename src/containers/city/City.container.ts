import { Container, Point, Sprite, Texture } from "pixi.js";
import { injectable, inject } from "inversify";
import TYPES from "../../types/MainConfig";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import { onEvent } from "../../utils/store.subscribe";
import ViewPort from "../../core/viewPort/ViewPort";
import { IBuildActionRequest, DrawCb } from "./types";
import {
  IBaseMapObject,
  MAP_OBJECT,
  MAP_OBJECT_TYPE,
} from "../../types/MapEntities";
import CityBuild from "../../entities/CityBuild.entity";
import {
  BUILD_REQUEST,
  RENDER_CITY,
  RE_RENDER_CITY,
  onTerrainClickAction,
  requestCompletedAction,
} from "./action";
import { ActionType } from "../../types/actions";
import CityLand from "../../entities/CityLand.entity";
import * as _ from "lodash";

export interface ContainerObject {
  sprite: Sprite;
  entity: MAP_OBJECT;
  coordinate: Point;
}

@injectable()
class CityContainer {
  protected store: StoreType;
  protected assetsLoader: AssetsLoader;
  protected viewPort: ViewPort;
  protected container: Container;

  protected cityTerrains: ContainerObject[] = [];
  protected cityObjects: ContainerObject[] = [];

  constructor(
    @inject(TYPES.Store) store: StoreType,
    @inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader,
    @inject(TYPES.ViewPort) viewPort: ViewPort
  ) {
    this.store = store;
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

  protected initContainer = () => {
    this.container = new Container();
    this.container.visible = false;
    this.container.name = "city";
  };

  protected initListeners = (): void => {
    const { subscribe } = this.store;
    subscribe(onEvent(RENDER_CITY, this.render.bind(this)));
    subscribe(onEvent(RE_RENDER_CITY, this.reRender.bind(this)));
    subscribe(onEvent(BUILD_REQUEST, this.buildRequest.bind(this)));
  };

  protected createMapObject = (object: IBaseMapObject): MAP_OBJECT => {
    let mapObject: MAP_OBJECT;

    switch (object.type) {
      case MAP_OBJECT_TYPE.LAND: {
        const grasTextures =
          this.assetsLoader.getResource("img/grass").textures;
        const grasTexturesKeys = Object.keys(grasTextures);
        const randomLandTexture =
          grasTexturesKeys[_.random(0, grasTexturesKeys.length - 1)];

        mapObject = new CityLand(
          object.x,
          object.y,
          grasTextures[randomLandTexture],
          MAP_OBJECT_TYPE.LAND
        );

        break;
      }

      case MAP_OBJECT_TYPE.HOME: {
        mapObject = new CityBuild(
          object.x,
          object.y,
          this.getTextureByObjectType(object.type),
          object.type
        );

        break;
      }

      default:
        break;
    }
    return mapObject;
  };

  protected getTextureByObjectType(type: MAP_OBJECT_TYPE): Texture {
    let fileName: string;
    switch (type) {
      case MAP_OBJECT_TYPE.HOME:
        fileName = "img/house-2-02";
        break;
      case MAP_OBJECT_TYPE.SENAT:
        fileName = "img/Senat_02";
      default:
        break;
    }
    return this.assetsLoader.getResource(fileName).texture;
  }

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

        const data = this.createMapObject(items[i][j]);
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
    const data = this.createMapObject(item);
    fn({ position, data, coordinate });
  };

  protected renderContent = () => {
    const appState = this.store.getState();
    this.drawMap(appState.city.terrain, this.renderTerrain);
    this.drawMap(appState.city.objects, this.renderObject);
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
    const { position, data, coordinate } = drawData;
    const tile = this.isoTile(data, position.x, position.y);
    tile.interactive = true;
    tile.on("pointerdown", this.onTerrainClick);
    this.cityTerrains.push({
      sprite: tile,
      entity: data,
      coordinate,
    });
    this.container.addChild(tile);
  };

  protected renderObject = (drawData: DrawCb) => {
    const { position, data, coordinate } = drawData;
    if (data && data instanceof CityBuild) {
      const isAnchorCoordinate =
        data.x === coordinate.x && data.y === coordinate.y;
      if (!isAnchorCoordinate) {
        return;
      }

      const tile = this.isoTile(data, position.x, position.y);
      this.cityObjects.push({
        sprite: tile,
        entity: data,
        coordinate,
      });
      this.container.addChild(tile);
    }
  };

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

  protected isoTile(data: MAP_OBJECT, x: number, y: number): Sprite {
    const tile = new Sprite(data.texture);
    tile.position.x = x + data.offsetX;
    tile.position.y = y + data.offsetY;

    // bottom-left
    tile.anchor.x = data.anchor.x;
    tile.anchor.y = data.anchor.y;
    tile.scale.set(data.scale, data.scale);

    return tile;
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
      this.store.dispatch(requestCompletedAction());
    }
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

    const isoX = distancePointToLIne(D1, A1, absolutePoint) / correlationX;
    const isoY = distancePointToLIne(A1, B1, absolutePoint) / correlationY;

    return new Point(isoX, isoY);
  };

  protected getMapCoordinate = (position: Point): Point => {
    const { tileHeight } = this.store.getState().config.citySize;

    const x = Math.trunc(position.x / tileHeight);
    const y = Math.trunc(position.y / tileHeight);
    return new Point(x, y);
  };
}

export default CityContainer;

function distancePointToLIne(X1: Point, X2: Point, P0: Point) {
  return (
    Math.abs(
      (X2.y - X1.y) * P0.x - (X2.x - X1.x) * P0.y + X2.x * X1.y - X2.y * X1.x
    ) / Math.sqrt(Math.pow(X2.y - X1.y, 2) + (X2.x - X1.x, 2))
  );
}
