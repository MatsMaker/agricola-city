export enum BUTTONS_TYPE {
	ROAD = "ROAD",
	HOME = "HOME",
	SENATE = "SENATE",
	RESET = "RESET",
}

export interface IMainMenuClick {
	buttonType: BUTTONS_TYPE;
}
