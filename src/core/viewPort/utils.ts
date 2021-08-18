import { AreaSizeType } from "core/config/types";
import { OrientationType } from "../../types/orientation";
import { SaveAreaType } from "./types";

export function waitReRenderViewPort(cb: Function) {
	const timeout: number = Number(process.env.RE_RENDER_TIMEOUT) || 300;
	setTimeout(cb, timeout);
}

export function getRotation(): OrientationType {
	return (window.innerHeight > window.innerWidth) ? OrientationType.PORTRAIT : OrientationType.LANDSCAPE
}

export function getWidth() {
	return window.innerWidth;
}

export function getHeight() {
	return window.innerHeight;
}

export function insideSizeArea(inner: AreaSizeType, wrapper: AreaSizeType): SaveAreaType {
	const innerRatio = inner.width / inner.height;
	const wrapperRatio = wrapper.width / wrapper.height;
	if (wrapperRatio >= innerRatio) {
		const width = wrapper.height * innerRatio;
		return {
			width: width,
			height: wrapper.height,
			x: (wrapper.width - width) / 2,
			y: 0,
			ratio: wrapper.height / inner.height,
		}
	} else {
		const height = wrapper.width / innerRatio;
		return {
			width: wrapper.width,
			height,
			x: 0,
			y: (wrapper.height - height) / 2,
			ratio: wrapper.width / inner.width,
		};
	}
}