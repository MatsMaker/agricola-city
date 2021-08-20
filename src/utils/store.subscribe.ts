import { store } from '../store';

export function onEvent(eventType: string, cb: Function) {
	return () => {
		const lastEvent = store.getState().lastAction;
		if (lastEvent.type === eventType) {
			cb(lastEvent, store);
		}
	}
}

export function onClearEvent(eventType: string, cb: Function) {
	return () => {
		const lastEvent = store.getState().lastAction;
		if (lastEvent.type === eventType) {
			cb(lastEvent.payload);
		}
	}
}