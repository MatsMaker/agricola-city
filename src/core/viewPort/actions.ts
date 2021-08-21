import { VIEW_PORT_RESIZE_ACTION, VPActionTypes } from "./types";

export function viewPortResizeAction(): VPActionTypes {
	return {
		type: VIEW_PORT_RESIZE_ACTION,
	};
}
