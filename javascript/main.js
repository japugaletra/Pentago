var game;
var loadScreen;


function Game(divId) {
	this.div = document.getElementById(divId);
}
function Player(id, name) {
	this.id = id;
}

function CreateLoadScreen() {
	loadScreen = document.createElement("div");
	loadScreen.id = "mainMenu";

	var buttonContainer = document.createElement("div");
	buttonContainer.id = "buttonContainer";

	var startButton = document.createElement("input");
	startButton.type = "button";
	startButton.value = "Start Game";
	startButton.onclick = StartGame;

	buttonContainer.appendChild(startButton);
	loadScreen.appendChild(buttonContainer);
}

function StartGame() {
	alert("yes");
}

function OnStart() {
	game = new Game("game");
	CreateLoadScreen();
	game.div.appendChild(loadScreen);
}

document.addEventListener('DOMContentLoaded', OnStart, false);