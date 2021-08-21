import { injectable, inject } from "inversify";
import isMobile from "ismobilejs";
import * as _ from "lodash";
import { StoreType } from "../../store";
import TYPES from "../../types/MainConfig";
import { waitReRenderViewPort } from "./utils";
import { viewPortResizeAction } from "./actions";
import { Application, Container, Ticker } from "pixi.js";
import { onEvent } from "../../utils/store.subscribe";
import { ViewPortState } from "./types";
import { VIEW_PORT_RESIZE_ACTION } from "./actions";

@injectable()
class ViewPort {
	protected store: StoreType;
	protected app: Application;

	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.Application) app: Application
	) {
		this.store = store;
		this.app = app;
		this.init();
	}

	public addTickOnce(
		fn: (...params: any[]) => any,
		context?: any,
		priority?: number
	): Ticker {
		// TODO will be fine to create decorator for cowered method and not use cb
		return this.app.ticker.addOnce(fn, context, priority);
	}

	public get scene(): Container {
		return this.app.stage;
	}

	public updateLayersOrder = (): void => {
		this.app.stage.children.sort(function (a, b) {
			a.zIndex = a.zIndex || 0;
			b.zIndex = b.zIndex || 0;
			return b.zIndex - a.zIndex;
		});
	};

	public getState(): ViewPortState {
		const { viewPort } = this.store.getState();
		return viewPort;
	}

	protected init = (): void => {
		this.initListeners();
		this.store.dispatch(viewPortResizeAction());
		this.resize();
		document.body.appendChild(this.app.view);
	};

	protected initListeners = (): void => {
		const { subscribe } = this.store;
		if (isMobile().any) {
			window.addEventListener("orientationchange", () => {
				waitReRenderViewPort(this.onScreenResized);
			});
		} else {
			window.addEventListener("resize", () => {
				waitReRenderViewPort(this.onScreenResized);
			});
		}
		subscribe(
			onEvent(VIEW_PORT_RESIZE_ACTION, () => {
				this.resize();
			})
		);
	};

	protected resize = (): void => {
		const { viewPort } = this.store.getState();
		this.app.resize();
		this.app.renderer.resize(viewPort.width, viewPort.height);
	};

	protected onScreenResized = _.debounce(() => {
		this.store.dispatch(viewPortResizeAction());
	}, 30);
}

export default ViewPort;
