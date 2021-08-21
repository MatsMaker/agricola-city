export interface ActionType<TAction> {
	type: TAction;
}

export interface ActionPayload<TAction, TPayload> {
	type: TAction;
	payload: TPayload;
}
