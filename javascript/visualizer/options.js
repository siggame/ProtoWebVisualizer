// Options
// data structure for the options of the visualizer core and plugins

var Options = new Object();
Options.options = new Array();

Options.addOption = function(option) {
	Options.options[option.key] = option;
	UI.addOption(option);
}

Options.getValue = function(key) {
	return options[key].value;
}

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
	value: 50

}
Notes: automatically incriments by 0.01

Radio:
{
	key: "Color",
	type: "Radio",
	values: ["red", "green", "blue"],
	value: "red"
}


*/