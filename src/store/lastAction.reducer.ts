import { AnyAction } from "redux";

const initState = {};
//@ts-ignore
export function lastAction(state: any = initState, action: AnyAction) {
	return action;
}
