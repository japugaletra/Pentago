///		CONSTANTS
var NUMBER_OF_QUADRANTS = 4;
var NUMBER_OF_ROWS = 4;
var NUMBER_OF_COLLUMNS = 4;
///		END CONSTANTS
var game;
var mainMenu;
var gameBoard;

function Game(divId) {
	this.div = document.getElementById(divId);
	this.players = null;
	this.currentPlayer = null;
	this.holes = new Array();
}

function Player(id, color) {
	this.id = id;
	this.color = color;
}

function Hole() {
	this.played = false;
	this.owner = null;

	this.PlacePeg = function(player) {
		this.owner = player;
		this.played = true;
	}
}

function CreateLoadScreen() {
	mainMenu = null;
	mainMenu = document.createElement("div");
	mainMenu.id = "mainMenu";

	var buttonContainer = document.createElement("div");
	buttonContainer.id = "buttonContainer";

	var startButton = document.createElement("input");
	startButton.type = "button";
	startButton.value = "Start Game";
	startButton.onclick = StartGame;

	buttonContainer.appendChild(startButton);
	mainMenu.appendChild(buttonContainer);
}

function CreateGameBoard() {
	gameBoard = null;
	gameBoard = document.createElement("div");
	gameBoard.id = "gameBoard";

	//Create 4 quadrants

	//Fill with buttons, 9 each
	//buttons link to holes array
	//set up holes array
	for(var quadrant = 0; quadrant < NUMBER_OF_QUADRANTS; quadrant++) {
		
		game.holes[quadrant] = new Array();
		for (var row = 0; row < NUMBER_OF_ROWS; row++) {
			game.holes[quadrant][row] = new Array();
			for (var collumn = 0; collumn < NUMBER_OF_COLLUMNS; collumn++) {
				game.holes[quadrant][row][collumn] = new Hole();
			}
		}
	}
}

function StartGame() {
	game.div.removeChild(mainMenu);
	CreateGameBoard();
	game.div.appendChild(gameBoard);
}

function OnStart() {
	game = new Game("game");
	CreateLoadScreen();
	game.div.appendChild(mainMenu);
}

document.addEventListener('DOMContentLoaded', OnStart, false);