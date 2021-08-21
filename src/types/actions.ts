export interface ActionType<TPayload = void> {
	type: string;
	payload?: TPayload;
}
