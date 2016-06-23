///		CONSTANTS
var NUMBER_OF_QUADRANTS = 4;
var NUMBER_OF_ROWS = 3;
var NUMBER_OF_COLUMNS = 3;
var EMPTY_HOLE_RED_RGB = "rgb(175,0,0)";
///		END CONSTANTS
var game;
var mainMenu;
var gameContainer;

///		OBJECTS
function Game(divId) {
	this.div = document.getElementById(divId);
	this.started = false;
	this.stage = null;
	this.players = new Array();
	this.currentPlayer = null;
	this.holes = new Array();
	this.messageLabel = null;

	this.StartGame = function() {
		if(!this.started) {
			var whiteColor = new RGBColor('255','255','255');
			var blackColor = new RGBColor('0','0','0');
			this.players[0] = new Player(0, "White", whiteColor);
			this.players[1] = new Player(1, "Black", blackColor);
			this.currentPlayer = this.players[0];
			this.messageLabel.innerHTML = this.currentPlayer.name + " : Placement";
			this.started = true;
			this.stage = "placement";
		}
	}

	this.PlayOnHolePosition = function () {
		//YOU ARE HERE
	}

}

function RGBColor(r,g,b) {
	this.r = r;
	this.g = g;
	this.b = g;
	this.toRGB = function() {
		return 'rgb(' + r + ',' + g +',' + b + ')';
	}
	this.toRGBA = function(a) {
		return 'rgba(' + r + ',' + g +',' + b + ',' + a + ')';
	}
}

function Player(id, name, RGBColor) {
	this.id = id;
	this.name = name;
	this.color = RGBColor;
}

function Hole() {
	this.played = false;
	this.owner = null;

	this.PlacePeg = function(player) {
		this.owner = player;
		this.played = true;
	}
}

/* 	Object: HolePosition

	Parameters: id - The id attached to the hole div
					 being turned into a hole position.

	Returns: HolePosition Object

	Description: Creates a HolePosition Object.
	This object has a quadrant, row and column.
*/
function HolePosition(id) {
	this.quadrant = parseInt(id[1]);
	this.row = parseInt(id[2]);
	this.column = parseInt(id[3]);
}
///		END OBJECTS

///		EVENT FUNCTIONS

/* 	Function: HoleOnHoverStart()

	Parameters: None

	Returns: None

	Description: Manages the onmouseover event of holes.
	If appropriate, Creates a shadow peg for user feedback.
*/
function HoleOnHoverStart() {
	var holPos = new HolePosition(this.id);
	var hole = game.holes[holPos.quadrant][holPos.row][holPos.column];
	if(!hole.played && game.stage == "placement"){
		this.style.background = game.currentPlayer.color.toRGBA(0.6);
	}
}

/* 	Function: HoleOnHoverEnd()

	Parameters: None

	Returns: None

	Description: Manages the onmouseout event of holes.
	If appropriate, removes the shadow peg for user feedback.
*/
function HoleOnHoverEnd() {
	var holPos = new HolePosition(this.id);
	var hole = game.holes[holPos.quadrant][holPos.row][holPos.column];
	if(!hole.played && game.stage == "placement"){
		this.style.background = EMPTY_HOLE_RED_RGB;
	}
}

/* 	Function: HoleOnClick()

	Parameters: None

	Returns: None

	Description: Manages the onclick event of holes.
	If appropriate, places a peg in an empty hole.
*/
function HoleOnClick() {
	var holPos = new HolePosition(this.id);
	var hole = game.holes[holPos.quadrant][holPos.row][holPos.column];
	if(!hole.played && game.stage == "placement"){
		game.PlayOnHolePosition(holPos);
	}
}

/// 	END EVENT FUNCTIONS

///		STANDARD FUNCTIONS
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

/* 	Function: SetUpGameBoard()

	Parameters: None

	Returns: None

	Description: Sets up the gameContainer object to contain
	the Pentago board. Also initialises the holes for the game object.
*/
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
				hole.onmouseover = HoleOnHoverStart;
				hole.onmouseout = HoleOnHoverEnd;
				hole.onclick = HoleOnClick;
				hole.className = "hole";
				hole.id = "h" + quadrantNum.toString() + row.toString() + column.toString();
				quadrant.appendChild(hole);
			}
		}

		board.appendChild(quadrant);
		gameContainer.appendChild(messageLabel);
		gameContainer.appendChild(board);
		game.messageLabel = messageLabel;	
	}
}

/* 	Function: StartNewGame()

	Parameters: None

	Returns: None

	Description: Called when the "New Game" button
	is clicked. creats and changes the displayed page to the 
	gameContainer instead of the menu and starts the game.
*/
function StartNewGame() {
	game.div.removeChild(mainMenu);
	SetUpGameBoard();
	game.div.appendChild(gameContainer);
	game.StartGame();
}

/* 	Function: OnStart()

	Parameters: None

	Returns: None

	Description: Runs once the page has been loaded.
	Initialises the game object and the div.
*/
function OnStart() {
	game = new Game("gameContainer");
	SetUpLoadScreen();
	game.div.appendChild(mainMenu);
}

document.addEventListener('DOMContentLoaded', OnStart, false);
///		END STANDARD FUNCTIONS