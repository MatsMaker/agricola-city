import { RENDER_BACKGROUND, ActionTypes, RE_RENDER_BACKGROUND } from './types'

export function renderBackgroundAction(): ActionTypes {
	return {
		type: RENDER_BACKGROUND,
	}
}

export function  reRenderBackgroundAction(): ActionTypes {
	return {
		type: RE_RENDER_BACKGROUND,
	}
}