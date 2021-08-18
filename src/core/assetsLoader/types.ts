export const ASSETS_IS_LOADED = '@CORE/ASSETS/is_loaded';

interface BaseAction {
	type: typeof ASSETS_IS_LOADED
}

export type AssetsActionTypes = BaseAction;

export interface AssetsState {
	assetsIsLoaded: boolean,
}
