///		CONSTANTS
var NUMBER_OF_QUADRANTS = 4;
var NUMBER_OF_ROWS = 3;
var NUMBER_OF_COLUMNS = 3;
///		END CONSTANTS
var game;
var mainMenu;
var gameContainer;

function Game(divId) {
	this.div = document.getElementById(divId);
	this.players = null;
	this.currentPlayer = null;
	this.holes = new Array();
	this.messageLabel = null;
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

function SetUpLoadScreen() {
	mainMenu = null;
	mainMenu = document.createElement("div");
	mainMenu.id = "mainMenu";

	var buttonContainer = document.createElement("div");
	buttonContainer.id = "buttonContainer";

	var startButton = document.createElement("input");
	startButton.type = "button";
	startButton.value = "Start Game";
	startButton.onclick = StartNewGame;

	buttonContainer.appendChild(startButton);
	mainMenu.appendChild(buttonContainer);
}

function SetUpGameBoard() {
	gameContainer = null;
	gameContainer = document.createElement("div");
	gameContainer.id = "gameBoardContainer";

	var board = document.createElement("div");
	board.id = "gameBoard";

	var messageLabel = document.createElement("p");
	messageLabel.id = "messageLabel";


	for(var quadrantNum = 0; quadrantNum < NUMBER_OF_QUADRANTS; quadrantNum++) {
		var quadrant = document.createElement("div");
		quadrant.className = "gameQuadrant";
		quadrant.id = "quad" + quadrantNum;

		game.holes[quadrantNum] = new Array();
		for (var row = 0; row < NUMBER_OF_ROWS; row++) {
			game.holes[quadrantNum][row] = new Array();
			for (var column = 0; column < NUMBER_OF_COLUMNS; column++) {
				game.holes[quadrantNum][row][column] = new Hole();
				var hole = document.createElement("div");
				hole.className = "hole";
				hole.id = "h" + quadrantNum.toString() + row.toString() + column.toString();
				quadrant.appendChild(hole);
			}
		}

		board.appendChild(quadrant);
		gameContainer.appendChild(messageLabel);
		gameContainer.appendChild(board);
		game.messageLabel = messageLabel;
		game.messageLabel.innerHTML = "Player 1: Placement";
	}
}

function StartNewGame() {
	game.div.removeChild(mainMenu);
	SetUpGameBoard();
	game.div.appendChild(gameContainer);
}

function OnStart() {
	game = new Game("gameContainer");
	SetUpLoadScreen();
	game.div.appendChild(mainMenu);
}

document.addEventListener('DOMContentLoaded', OnStart, false);