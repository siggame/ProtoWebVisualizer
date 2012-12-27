// The default options to be loaded upon visualizer core initialization
Visualizer.defaultOptions = [
	{
		key: "Enable Something",
		type: "checkbox",
		value: true
	},
	{
		key: "Mode",
		type: "select",
		values: ["Normal", "Arena", "Advertisement"],
		value: "Normal",
	},
	{
		key: "Hatred",
		type: "slider",
		range: [0,10],
		step: 1,
		value: 2,
	}
];

/* Examples:

Checkbox:
{
	key: "Enable Something",
	type: "checkbox",
	value: true
}
Notes: range is automatically [0,1], aka true or false

Slider:
{
	key: "Draw Distance",
	type: "slider",
	range: [0, 100],
	step: 0.01, // optional!
	value: 50

}
Notes: automatically incriments by 0.01

Drop Down, AKA Select:
{
	key: "Color",
	type: "select",
	values: ["red", "green", "blue"],
	value: "red"
}


*/