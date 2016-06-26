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
	this.turnInfo = null;
	this.gameInstructions = null;
	this.selectedQuadrant = null;

	this.StartGame = function() {
		if (!this.started) {
			var whiteColor = new RGBColor('255','255','255');
			var blackColor = new RGBColor('0','0','0');
			this.players[0] = new Player(0, "White", whiteColor);
			this.players[1] = new Player(1, "Black", blackColor);
			this.started = false;
			this.currentPlayer = this.players[0];
			this.GoToPlacement();			
		}
	}

	this.PlayOnHolePosition = function(holePosition) {
		this.holes[holePosition.quadrant][holePosition.row][holePosition.column].PlacePeg(this.currentPlayer);
		this.GoToRotation();
	}

	this.UpdateLabel = function() {
		this.turnInfo.innerHTML = this.currentPlayer.name + " : " +  this.stage;
	}

	this.ShowRotationButtons = function() {
		setTimeout(function() {
			var rotationButtons = document.querySelectorAll(".rotationArrow");
			for (var i = 0; i < rotationButtons.length; i++) {
				rotationButtons[i].style.opacity = 1;
				rotationButtons[i].style.cursor = "pointer";
			}
		},500);
	}

	this.StartTransitionStage = function(newStage,newGameInstructions) {
		this.stage = "Animating";
		var textElements = document.querySelectorAll(".gameText");
		for (var i = 0; i < textElements.length; i++) {
			textElements[i].style.opacity = 0;
		}

		setTimeout(function() {
			game.EndTransitionStage(textElements,newStage,newGameInstructions);
		},500);
	}

	this.EndTransitionStage = function(textElements,newStage,newGameInstructions) {
		for (var i = 0; i < textElements.length; i++) {
			textElements[i].style.opacity = 1;
		}
		this.stage = newStage;
		this.UpdateLabel();
		this.stage = "Animating";
		this.gameInstructions.innerHTML = newGameInstructions;
		setTimeout(function() {
			game.stage = newStage;
		},500);
	}	

	this.GoToPlacement = function() {
		if (this.started) {
			this.StartTransitionStage("Placement","select a peg");
			this.ChangeHoleCursor("Pointer");
		} else {
			this.started = true;
			this.stage = "Placement";
			this.UpdateLabel();
			this.gameInstructions.innerHTML = "select a peg";
		}
	}

	this.GoToRotation = function() {
		this.ChangeQuadrantCursor("Pointer");
		this.StartTransitionStage("Rotation","select a quadrant");
	}

	this.ChangeHoleCursor = function(cursor) {
		var holeElements = document.querySelectorAll(".hole");
		for (var i = 0; i < holeElements.length; i++) {
			holeElements[i].style.cursor = cursor;
		}
	}

	this.ChangeQuadrantCursor = function(cursor) {
		var quadrantElements = document.querySelectorAll(".gameQuadrant");
		for (var i = 0; i < quadrantElements.length; i++) {
			quadrantElements[i].style.cursor = cursor;
		}
	}

	this.SelectQuadrant = function(quadrant) {
		this.selectedQuadrant = quadrant;
		var XTranslate = '15%';
		var YTranslate = '15%';
		if(quadrant % 2 == 0) {
			XTranslate = '-15%';
		}
		if(quadrant < 2) {
			YTranslate = '-15%';
		}
		document.getElementById("quad" + quadrant).style.transform = "translate(" + XTranslate + "," + YTranslate + ")";
		for(var i = 1; i < 4; i++) {
			var otherQuadrant = (this.selectedQuadrant + i) % 4;
			document.getElementById("quad" + otherQuadrant).style.transform = "translate(0%,0%)";
		}
		this.StartTransitionStage("Rotation", "select a direction");
		this.ShowRotationButtons();

	}

	this.SelectRotation = function(direction) {
		this.selectedQuadrant = null;
	}
}
/* 	Object: RGBColor

	Parameters: r - red value integer (0-255)
				g - green value integer (0-255)
				b - blue value integer (0-255)

	Returns: RGBColor Object

	Description: Creates a RGBColor Object.
*/
function RGBColor(r,g,b) {
	this.r = r;
	this.g = g;
	this.b = g;

	/* RGBColor.toRGB()
		Parameters: None
		
		Returns: rgb css string

		Description: converts the RGBColor object into a
		css "rgb" string.
	*/
	this.toRGB = function() {
		return 'rgb(' + r + ',' + g +',' + b + ')';
	}

	/* RGBColor.toRGBA()
		Parameters: a - opacity percentage (0-1)
		
		Returns: rgba css string

		Description: converts the RGBColor object into a
		css "rgba" string.
	*/
	this.toRGBA = function(a) {
		return 'rgba(' + r + ',' + g +',' + b + ',' + a + ')';
	}
}

/* 	Object: Player

	Parameters: id - Id of the player
				name - name of the player
				RGBColor - RGBColor corresponding to the player

	Returns: Player Object

	Description: Creates a Player Object.
*/
function Player(id, name, RGBColor) {
	this.id = id;
	this.name = name;
	this.color = RGBColor;
}

/* 	Object: Hole

	Parameters: None

	Returns: Hole Object

	Description: Creates a Hole Object.
*/
function Hole() {
	this.played = false;
	this.owner = null;

	/* Hole.PlacePeg()
		Parameters: player - the player who is playing a peg
					in the hole.
		
		Returns: None

		Description: Assigns the owner and makes the hole played.
	*/
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
	if (!hole.played && game.stage == "Placement") {
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
	if (!hole.played && game.stage == "Placement") {
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
	if (!hole.played && game.stage == "Placement") {
		this.style.background = game.currentPlayer.color.toRGB();
		game.PlayOnHolePosition(holPos);
	}
}

function QuadrantOnHoverStart() {
	var quadrant = parseInt(this.id[4]);	
	if (game.selectedQuadrant != quadrant && game.stage == "Rotation") {
		this.style.opacity = 0.5;
	}
}

function QuadrantOnHoverEnd() {
	var quadrant = parseInt(this.id[4]);
	if (game.selectedQuadrant != quadrant && game.stage == "Rotation") {
		this.style.opacity = 1;
	}
}

function QuadrantOnClick() {
	var quadrant = parseInt(this.id[4]);
	if (game.selectedQuadrant != quadrant && game.stage == "Rotation") {
		this.style.opacity = 1;
		game.SelectQuadrant(quadrant);
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

	var turnInfo = document.createElement("p");
	var gameInstructions = document.createElement("p");
	turnInfo.id = "turnInfo";
	turnInfo.className = "gameText";
	gameInstructions.id = "gameInstructions";
	gameInstructions.className = "gameText";

	var anticlockwiseArrow = document.createElement("div");
	anticlockwiseArrow.id = "anticlockwiseArrow";
	anticlockwiseArrow.className = "rotationArrow";
	var clockwiseArrow = document.createElement("div");
	clockwiseArrow.id = "clockwiseArrow";
	clockwiseArrow.className = "rotationArrow";

	for (var quadrantNum = 0; quadrantNum < NUMBER_OF_QUADRANTS; quadrantNum++) {
		var quadrant = document.createElement("div");
		quadrant.className = "gameQuadrant";
		quadrant.id = "quad" + quadrantNum;
		quadrant.onmouseover = QuadrantOnHoverStart;
		quadrant.onmouseout = QuadrantOnHoverEnd;
		quadrant.onclick = QuadrantOnClick;

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
		gameContainer.appendChild(board);
		
			
	}
	gameContainer.appendChild(turnInfo);
	gameContainer.appendChild(gameInstructions);
	gameContainer.appendChild(anticlockwiseArrow);
	gameContainer.appendChild(clockwiseArrow);
	game.turnInfo = turnInfo;	
	game.gameInstructions = gameInstructions;
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