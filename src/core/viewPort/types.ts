import { OrientationType } from "../../types/orientation"

export const VIEW_PORT_RESIZE_ACTION = '@CORE/VIEW_PORT/resize'
export interface BaseAction {
	type: typeof VIEW_PORT_RESIZE_ACTION
}

export interface ViewPortBaseState {
	rotation: OrientationType,
	ratio: number,
	width: number,
	height: number,
	centerWidth: number,
	centerHeight: number,
}
export interface ViewPortState extends ViewPortBaseState{
}

export type VPActionTypes = BaseAction;
