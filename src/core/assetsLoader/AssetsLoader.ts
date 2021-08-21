import { Loader, LoaderResource } from "pixi.js";
import * as WebFont from "webfontloader";
import { injectable, inject } from "inversify";
import * as _ from "lodash";
import * as path from "path";
import TYPES from "../../types/MainConfig";
import Config from "../config/Config";
import { StoreType } from "../../store";
import { assetsIsLoadedAction } from "./actions";
import { removeExtension } from "../../utils/loader";

@injectable()
class AssetsLoader {
	protected store: StoreType;
	protected loader: Loader;
	protected config: Config;
	protected cbOnReady: Function;
	protected resources: Partial<Record<string, LoaderResource>>;
	protected webFont: any; // WebFont
	protected assetsIsLoaded: boolean = false;
	protected fontsIsLoaded: boolean = false;

	constructor(
		@inject(TYPES.Store) store: StoreType,
		@inject(TYPES.Config) config: Config
	) {
		this.store = store;
		this.config = config;
		this.loader = new Loader();
		this.fontLoader();
		this.initListeners();
	}

	public getResource = (key: string): LoaderResource => {
		return this.resources[key];
	};

	public load = (): void => {
		this.prepareAssets();
		this.loader.load();
	};

	protected initListeners(): void {
		this.loader.onComplete.add(this.onComplete);
	}

	protected prepareAssets(): void {
		const assetsPath: string = this.config.getAssetsPath();
		const assetsList: Array<string> = this.config.getAssetsList();
		_.forEach(assetsList, (imgItem: string) => {
			const imgPath: string = path.resolve(assetsPath, imgItem);
			const imgName: string = AssetsLoader.getNameByPath(imgItem);
			this.loader.add(imgName, imgPath);
		});
	}

	static getNameByPath(assetsPath: string): string {
		if (assetsPath.indexOf("spine/") === 0) {
			return assetsPath;
		}
		return removeExtension(assetsPath);
	}

	protected fontLoader = () => {
		const fonts = this.config.get("fonts");
		WebFont.load({
			...fonts,
			fontloading: this.onFontsIsLoaded,
		});
	};

	protected onFontsIsLoaded = () => {
		this.fontsIsLoaded = true;
		this.dataIsLoaded();
	};

	protected onComplete = (
		// @ts-ignore
		loader: Loader,
		resources: Partial<Record<string, LoaderResource>>
	) => {
		this.proxyAssets(resources);
		this.assetsIsLoaded = true;
		this.dataIsLoaded();
	};

	protected proxyAssets = (
		resources: Partial<Record<string, LoaderResource>>
	) => {
		this.resources = resources;
	};

	protected dataIsLoaded = (): void => {
		if (this.assetsIsLoaded && this.fontsIsLoaded) {
			this.store.dispatch(assetsIsLoadedAction());
		}
	};
}

export default AssetsLoader;
