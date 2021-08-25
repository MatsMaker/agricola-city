export interface IRoadMask {
	mask: boolean[][];
	textureTile: string;
}

const roadMasksTypes: IRoadMask[] = [
	// true - must be something
	// false - must be empty
	// undefined - is not matter
	{
		mask: [
			[false, undefined, false],
			[false, undefined, false],
			[false, false, false],
		],
		textureTile: "road12.png",
	},
	{
		mask: [
			[undefined, false, undefined],
			[true, undefined, false],
			[undefined, true, undefined],
		],
		textureTile: "road9.png",
	},
	{
		mask: [
			[undefined, true, undefined],
			[false, undefined, true],
			[undefined, false, undefined],
		],
		textureTile: "road8.png",
	},
	{
		mask: [
			[undefined, true, undefined],
			[true, undefined, false],
			[undefined, false, undefined],
		],
		textureTile: "road13.png",
	},
	{
		mask: [
			[false, false, false],
			[true, undefined, true],
			[false, false, false],
		],
		textureTile: "road1.png",
	},
	{
		mask: [
			[undefined, false, undefined],
			[false, undefined, true],
			[undefined, false, undefined],
		],
		textureTile: "road1.png",
	},
	{
		mask: [
			[undefined, false, undefined],
			[true, undefined, undefined],
			[undefined, false, undefined],
		],
		textureTile: "road1.png",
	},
	{
		mask: [
			[undefined, false, undefined],
			[false, undefined, false],
			[undefined, true, undefined],
		],
		textureTile: "road2.png",
	},
	{
		mask: [
			[undefined, true, undefined],
			[false, undefined, false],
			[undefined, undefined, undefined],
		],
		textureTile: "road2.png",
	},
	{
		mask: [
			[undefined, true, undefined],
			[false, undefined, true],
			[undefined, true, undefined],
		],
		textureTile: "road14.png",
	},
	{
		mask: [
			[undefined, true, undefined],
			[true, undefined, true],
			[undefined, true, undefined],
		],
		textureTile: "road3.png",
	},
	{
		mask: [
			[undefined, true, undefined],
			[true, undefined, true],
			[undefined, false, undefined],
		],
		textureTile: "road10.png",
	},
	{
		mask: [
			[undefined, undefined, undefined],
			[true, undefined, false],
			[undefined, undefined, undefined],
		],
		textureTile: "road15.png",
	},
	{
		mask: [
			[undefined, false, undefined],
			[true, undefined, true],
			[undefined, undefined, undefined],
		],
		textureTile: "road5.png",
	},
	{
		mask: [
			[undefined, undefined, undefined],
			[undefined, undefined, undefined],
			[undefined, undefined, undefined],
		],
		textureTile: "road7.png",
	},
];

export default roadMasksTypes;
