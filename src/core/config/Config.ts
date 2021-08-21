import { injectable } from "inversify";
import { BASE_MAP_OBJECT } from "types/MapEntities";
import { GSettings, AreaSizeType } from "./types";

@injectable()
class Config {
	protected settings: GSettings;

	constructor(settings: GSettings) {
		this.settings = settings;
	}

	public get(key: string) {
		return this.settings[key];
	}

	public getAssetsPath = (): string => {
		return this.settings.assetsPath;
	};

	public getAssetsList = (): Array<string> => {
		return this.settings.assetsList;
	};

	public getCitySize = (): AreaSizeType => {
		return this.settings.citySize;
	};

	public getStartCityData = (): BASE_MAP_OBJECT[] => {
		return this.settings.startCityData;
	};
}

export default Config;
