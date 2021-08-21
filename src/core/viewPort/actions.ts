import { ActionType } from "../../types/actions";

export const VIEW_PORT_RESIZE_ACTION = "@CORE/VIEW_PORT/resize";

export function viewPortResizeAction(): ActionType {
	return {
		type: VIEW_PORT_RESIZE_ACTION,
	};
}
