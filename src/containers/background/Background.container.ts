import { Container, Sprite } from "pixi.js";
import { injectable, inject } from "inversify";
import TYPES from "../../types/MainConfig";
import AssetsLoader from "../../core/assetsLoader/AssetsLoader";
import { StoreType } from "store";
import { onEvent } from "../../utils/store.subscribe";
import { RENDER_BACKGROUND, RE_RENDER_BACKGROUND } from "./types";
import ViewPort from "../../core/viewPort/ViewPort";

@injectable()
class BackgroundContainer {
  protected store: StoreType;
  protected assetsLoader: AssetsLoader;
  protected viewPort: ViewPort;
  protected container: Container;
  protected baseSprite: Sprite;

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
    this.container.name = "background";
  };

  protected initListeners = (): void => {
    const { subscribe } = this.store;
    subscribe(onEvent(RENDER_BACKGROUND, this.render.bind(this)));
    subscribe(onEvent(RE_RENDER_BACKGROUND, this.reRender.bind(this)));
  };

  protected renderContent = () => {
    const bgAsset = this.assetsLoader.getResource("img/bg-prlx-big");
    this.baseSprite = new Sprite(bgAsset.texture);
    this.baseSprite.anchor.set(0.5, 0.5);
    this.baseSprite.scale.set(2, 2);
    this.container.addChild(this.baseSprite);
    this.reRender();
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
    this.viewPort.addTickOnce(() => {
      const { viewPort } = this.store.getState();
      this.baseSprite.position.set(viewPort.centerWidth, viewPort.centerHeight);
    });
  }
}

export default BackgroundContainer;
