import { Point } from "pixi.js";
export interface IRoadMask {
	mask: boolean[][];
	textureTile: string;
	bias: Point;
}

const roadMasksTypes: IRoadMask[] = [
	// true - must be something
	// false - must be empty
	// undefined - is not matter
	{
		mask: [
			[undefined, false, undefined],
			[true, undefined, false],
			[undefined, true, undefined],
		],
		textureTile: "road9.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, true, undefined],
			[false, undefined, true],
			[undefined, false, undefined],
		],
		textureTile: "road8.png",
		bias: new Point(5, 0),
	},
	{
		mask: [
			[undefined, true, undefined],
			[true, undefined, false],
			[undefined, false, undefined],
		],
		textureTile: "road13.png",
		bias: new Point(-2, -6),
	},
	{
		mask: [
			[false, false, false],
			[true, undefined, true],
			[false, false, false],
		],
		textureTile: "road1.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, false, undefined],
			[false, undefined, true],
			[undefined, false, undefined],
		],
		textureTile: "road1.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, false, undefined],
			[true, undefined, undefined],
			[undefined, false, undefined],
		],
		textureTile: "road1.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, false, undefined],
			[false, undefined, false],
			[undefined, true, undefined],
		],
		textureTile: "road2.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, true, undefined],
			[false, undefined, false],
			[undefined, undefined, undefined],
		],
		textureTile: "road2.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[false, undefined, false],
			[false, undefined, false],
			[false, false, false],
		],
		textureTile: "road12.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, true, undefined],
			[false, undefined, true],
			[undefined, true, undefined],
		],
		textureTile: "road14.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, true, undefined],
			[true, undefined, true],
			[undefined, true, undefined],
		],
		textureTile: "road3.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, true, undefined],
			[true, undefined, true],
			[undefined, false, undefined],
		],
		textureTile: "road10.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, undefined, undefined],
			[true, undefined, false],
			[undefined, undefined, undefined],
		],
		textureTile: "road15.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, false, undefined],
			[true, undefined, true],
			[undefined, undefined, undefined],
		],
		textureTile: "road5.png",
		bias: new Point(0, 0),
	},
	{
		mask: [
			[undefined, undefined, undefined],
			[undefined, undefined, undefined],
			[undefined, undefined, undefined],
		],
		textureTile: "road7.png",
		bias: new Point(2, 1),
	},
];

export default roadMasksTypes;
