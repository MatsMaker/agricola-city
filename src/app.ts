import { Application } from "pixi.js";

const app = new Application({
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: 0x1099bb,
	antialias: true,
	transparent: true,
	resolution: 1,
});

export default app;
