import "reflect-metadata";
import * as PIXI from "pixi.js";
import { isDevelopment } from "./utils/build";
import { main } from "./main.config";
import TYPES from "./types/MainConfig";
import Game from "./game/Game";

// import tryInitInFullscreen from "./fullScreen";
// tryInitInFullscreen(start);
start();

function start() {
	if (isDevelopment()) {
		PIXI.useDeprecated();
		(<any>window).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
			(<any>window).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
	}

	const game = main.get<Game>(TYPES.Game);
	game.launch();
}
