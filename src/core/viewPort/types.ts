import { OrientationType } from "../../types/orientation";

export interface ViewPortBaseState {
	rotation: OrientationType;
	ratio: number;
	width: number;
	height: number;
	centerWidth: number;
	centerHeight: number;
}
export interface ViewPortState extends ViewPortBaseState { }
