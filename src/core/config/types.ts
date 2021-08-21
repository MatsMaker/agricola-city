export interface IAreaSizeType {
	width: number;
	height: number;
	tileWidth: number;
	tileHeight: number;
	distortionFactor: number;
}

export interface GSettings {
	assetsPath: string;
	[key: string]: any;
}
