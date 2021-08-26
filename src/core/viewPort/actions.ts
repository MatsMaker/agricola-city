import { ActionType } from "../../types/actions";
import { TickAction } from "./types";


export const VIEW_PORT_RESIZE_ACTION = "@CORE/VIEW_PORT/resize";

export function viewPortResizeAction(): ActionType {
	return {
		type: VIEW_PORT_RESIZE_ACTION,
	};
}

export const VIEW_PORT_TICK = "@CORE/VIEW_PORT/tick";

export function viewPortTick(payload: TickAction): ActionType<TickAction> {
	return {
		type: VIEW_PORT_TICK,
		payload,
	};
}
