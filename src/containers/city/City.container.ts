import { Container, Point, Sprite } from "pixi.js";
import { injectable, inject } from "inversify";
import TYPES from "../../types/MainConfig";
import Config from "../../core/config/Config";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import { onEvent } from "../../utils/store.subscribe";
import ViewPort from "../../core/viewPort/ViewPort";
import { BuildActionRequest, CityActionTypePayload, DrawCb } from "./types";
import CityEntity from "../../entities/City.entity";
import { MAP_OBJECT } from "../../types/MapEntities";
import CityBuild from "../../entities/CityBuild.entity";
import {
  BUILD,
  onTerrainClickAction,
  RENDER_CITY,
  RE_RENDER_CITY,
} from "./action";

export interface ContainerObject {
  sprite: Sprite;
  entity: MAP_OBJECT;
  coordinate: Point;
}

@injectable()
class CityContainer {
  protected store: StoreType;
  protected config: Config;
  protected assetsLoader: AssetsLoader;
  protected viewPort: ViewPort;
  protected container: Container;
  protected cityEntity: CityEntity;

  protected cityTerrains: ContainerObject[] = [];
  protected cityObjects: ContainerObject[] = [];

  constructor(
    @inject(TYPES.Store) store: StoreType,
    @inject(TYPES.Config) config: Config,
    @inject(TYPES.AssetsLoader) assetsLoader: AssetsLoader,
    @inject(TYPES.ViewPort) viewPort: ViewPort
  ) {
    this.store = store;
    this.config = config;
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
    this.initCity();
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
    subscribe(onEvent(BUILD, this.build.bind(this)));
  };

  protected initCity = (): void => {
    this.cityEntity = new CityEntity(this.config, this.assetsLoader);
  };

  protected drawMap = (
    items: MAP_OBJECT[][],
    fn: (drawData: DrawCb) => void
  ) => {
    const { tileWidth, tileHeight, distortionFactor } =
      this.config.getCitySize();
    const { centerWidth } = this.viewPort.getState();

    const drawStart: Point = new Point(centerWidth - tileWidth, tileHeight);

    let x, y, isoX, isoY;
    for (let i = 0, iL = items.length; i < iL; i++) {
      for (let j = 0, jL = items[i].length; j < jL; j++) {
        // cartesian 2D coordinate
        x = j * tileWidth;
        y = i * tileHeight;

        // iso coordinate
        isoX = x - y + drawStart.x;
        isoY = (x + y) / distortionFactor + drawStart.y;

        const data = items[i][j];
        const position = new Point(isoX, isoY);
        const coordinate = new Point(j, i);
        fn({ position, data, coordinate });
      }
    }
  };

  protected drawOne = (
    item: MAP_OBJECT,
    coordinate: Point,
    fn: (drawData: DrawCb) => void
  ) => {
    const { tileWidth, tileHeight } = this.config.getCitySize();
    const { centerWidth } = this.viewPort.getState();

    const drawStart: Point = new Point(centerWidth - tileWidth, tileHeight);

    // cartesian 2D coordinate
    const x = coordinate.x * tileWidth;
    const y = coordinate.y * tileHeight;

    // iso coordinate
    const isoX = x - y + drawStart.x;
    const isoY = (x + y) / 2 + drawStart.y;

    const position = new Point(isoX, isoY);
    const data = item;
    fn({ position, data, coordinate });
  };

  protected renderContent = () => {
    this.cityEntity.init();

    this.drawMap(this.cityEntity.terrain, this.renderTerrain);

    this.drawMap(this.cityEntity.objects, this.renderObject);

    this.reRender();
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

  protected build(payload: CityActionTypePayload<BuildActionRequest>): void {
    const build = this.cityEntity.newBuild(
      payload.payload.objectType,
      payload.payload.coordinate
    );
    this.drawOne(build, payload.payload.coordinate, this.renderObject);
  }

  protected getIso = (absolutePoint: Point): Point => {
    const { width, height, tileWidth, tileHeight, distortionFactor } =
      this.config.getCitySize();
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
    const { tileHeight } = this.config.getCitySize();

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
