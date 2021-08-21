import { OrientationType } from "../../types/orientation";

export function waitReRenderViewPort(cb: Function) {
	const timeout: number = Number(process.env.RE_RENDER_TIMEOUT) || 300;
	setTimeout(cb, timeout);
}

export function getRotation(): OrientationType {
	return window.innerHeight > window.innerWidth
		? OrientationType.PORTRAIT
		: OrientationType.LANDSCAPE;
}

export function getWidth() {
	return window.innerWidth;
}

export function getHeight() {
	return window.innerHeight;
}
