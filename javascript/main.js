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
/*
	Next step: Do Rotation buttons. assign method + link to game object
*/
function Game(divId) {
	this.div = document.getElementById(divId);
	this.started = false;
	this.stage = null;
	this.players = new Array();
	this.currentPlayer = null;
	this.holes = new Array();
	this.selectedQuadrant = null;
	this.UI = null;

	this.StartGame = function() {
		if (!this.started) {
			var whiteColor = new RGBColor('255','255','255');
			var blackColor = new RGBColor('0','0','0');
			this.UI = new GameUIManager();
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

	this.StartTransitionStage = function(newStage,newGameInstructions) {
		this.stage = "Animating";
		this.UI.HideGameText();

		setTimeout(function() {
			game.EndTransitionStage(newStage,newGameInstructions);
		},500);
	}

	this.EndTransitionStage = function(newStage,newGameInstructions) {
		this.UI.UpdateTurnInfo(this.currentPlayer.name + " : " +  newStage);
		this.UI.ShowGameText();
		this.UI.UpdateGameInstructions(newGameInstructions);
		setTimeout(function() {
			game.stage = newStage;
		},500);
	}	

	this.GoToPlacement = function() {
		if (this.started) {
			this.StartTransitionStage("Placement","select a peg");
			this.UI.ChangeAllHoleCursors("Pointer");
		} else {
			this.started = true;
			this.stage = "Placement";
			this.UI.UpdateTurnInfo(this.currentPlayer.name + " : " +  this.stage);
			this.UI.UpdateGameInstructions("select a peg");
		}
	}

	this.GoToRotation = function() {
		this.UI.ChangeAllQuadrantCursors("Pointer");
		this.StartTransitionStage("Rotation","select a quadrant");
	}

	

	this.SelectQuadrant = function(quadrant) {
		this.selectedQuadrant = quadrant;
		this.UI.PullOutQuadrant(quadrant);
		
		this.UI.ShowRotationButtons();
	}

	this.RotateCurrentQuadrantClockwise = function() {
		var quadrantToRotate = this.selectedQuadrant;
		this.SwapPlayers();
		this.GoToPlacement();
		this.UI.RotateQuadrantClockwise(quadrantToRotate);
		this.StartTransitionStage("Placement","select a peg");
		setTimeout(function() {
			game.MoveHolesInQuadrantClockwise(quadrantToRotate);
			game.UI.ResetQuadrantDisplay(quadrantToRotate);
		},1000);
		this.selectedQuadrant = null;
	}

	this.MoveHolesInQuadrantClockwise = function(quadrant) {
		var originalHoles = this.holes[quadrant];
		for (var row = 0; row < NUMBER_OF_ROWS; row++) {
			for (var column = 0; column < NUMBER_OF_COLUMNS; column++) {
				var newRow = column;
				var newColumn = (NUMBER_OF_COLUMNS - 1) - row;
				this.holes[quadrant][newRow][newColumn] = originalHoles[row][column];
			}
		}
	}

	this.SwapPlayers = function() {
		var currentPlayerId = this.currentPlayer.id;
		var nextPlayerId = (currentPlayerId + 1) % this.players.length;
		this.currentPlayer = this.players[nextPlayerId];
	}
}

function GameUIManager() {
	this.currentTransform = null;

	this.ResetQuadrantDisplay = function(quadrant) {
		var quadrantElement = document.getElementById("quad" + quadrant);
		quadrantElement.style.transition = "0s";
		quadrantElement.style.tranform = "";
		quadrantElement.style.transition = "0.5s";


	}

	this.UpdateTurnInfo = function(newTurnInfo) {
		document.getElementById("turnInfo").innerHTML = newTurnInfo;
	}

	this.UpdateGameInstructions = function(newGameInstructions) {
		document.getElementById("gameInstructions").innerHTML = newGameInstructions;
	}

	this.HideGameText = function() {
		var textElements = document.querySelectorAll(".gameText");
		for (var i = 0; i < textElements.length; i++) {
			textElements[i].style.opacity = 0;
		}
	}

	this.ShowGameText = function() {
		var textElements = document.querySelectorAll(".gameText");
		for (var i = 0; i < textElements.length; i++) {
			textElements[i].style.opacity = 1;
		}
	}

	this.ChangeAllHoleCursors = function(cursor) {
		var holeElements = document.querySelectorAll(".hole");
		for (var i = 0; i < holeElements.length; i++) {
			holeElements[i].style.cursor = cursor;
		}
	}


	this.UpdateQuadrantAndHolesCursor = function(quadrant, newCursor) {
		document.getElementById("quad" + quadrant).style.cursor = newCursor;
		for (var row = 0; row < NUMBER_OF_ROWS; row++) {
			for (var column = 0; column < NUMBER_OF_COLUMNS; column++) {
				var hole = document.getElementById("h" + quadrant.toString() + row.toString() + column.toString());
				hole.style.cursor = newCursor;
			}
		}

	}

	this.ChangeAllQuadrantCursors = function(cursor) {
		var quadrantElements = document.querySelectorAll(".gameQuadrant");
		for (var i = 0; i < quadrantElements.length; i++) {
			quadrantElements[i].style.cursor = cursor;
		}
	}

	this.ShowRotationButtons = function() {
		setTimeout(function() {
			var rotationButtons = document.querySelectorAll(".rotationArrow");
			for (var i = 0; i < rotationButtons.length; i++) {
				rotationButtons[i].style.opacity = 1;
				rotationButtons[i].style.display = "initial";
				rotationButtons[i].style.cursor = "pointer";
			}
		},500);
	}

	this.PullOutQuadrant = function(quadrant) {
		var XTranslate = '15%';
		var YTranslate = '15%';
		if(quadrant % 2 == 0) {
			XTranslate = '-15%';
		}
		if(quadrant < 2) {
			YTranslate = '-15%';
		}
		this.currentTransform = "translate(" + XTranslate + "," + YTranslate + ")";
		document.getElementById("quad" + quadrant).style.transform = this.currentTransform;
		this.UpdateQuadrantAndHolesCursor(quadrant,"default");

		for(var i = 1; i < 4; i++) {
			var otherQuadrant = (game.selectedQuadrant + i) % 4;
			document.getElementById("quad" + otherQuadrant).style.transform = "translate(0%,0%)";
			this.UpdateQuadrantAndHolesCursor(otherQuadrant,"Pointer");
		}
	}


	this.TiltQuadrantClockwise = function(quadrant) {
		var chosenQuadrant = document.getElementById("quad" + quadrant);
		chosenQuadrant.style.transform += " rotate(15deg)";
	}

	this.RotateQuadrantClockwise = function(quadrant) {
		var chosenQuadrant = document.getElementById("quad" + quadrant);
		chosenQuadrant.style.transform = this.currentTransform + " rotate(90deg)";
		setTimeout(function() {
			chosenQuadrant.style.transform = "rotate(90deg)";
		},500);
	}

	this.TiltQuadrantAnticlockwise = function(quadrant) {
		var chosenQuadrant = document.getElementById("quad" + quadrant);
		chosenQuadrant.style.transform += " rotate(-15deg)";
	}

	this.UntiltQuadrant = function(quadrant) {
		var chosenQuadrant = document.getElementById("quad" + quadrant);
		chosenQuadrant.style.transform = this.currentTransform;
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

function RotationOnHoverStart() {
	if(game.stage == "Rotation") {
		if(this.id == "clockwiseArrow") {
			game.UI.TiltQuadrantClockwise(game.selectedQuadrant);
		} else {
			game.UI.TiltQuadrantAnticlockwise(game.selectedQuadrant);
		}
		this.style.cursor = "pointer";
		this.style.backgroundColor = "lightgrey";
	}
}

function RotationOnHoverEnd() {
	if(game.stage == "Rotation") {
		game.UI.UntiltQuadrant(game.selectedQuadrant);
	}
	this.style.backgroundColor = "white";
	this.style.cursor = "default";
}

function RotationOnClick() {
	if(game.stage == "Rotation") {
		if(this.id == "clockwiseArrow") {
			game.RotateCurrentQuadrantClockwise();
		} else {
			game.RotateCurrentQuadrantAntilockwise();
		}
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
	anticlockwiseArrow.onmouseover = RotationOnHoverStart;
	anticlockwiseArrow.onmouseout = RotationOnHoverEnd;
	anticlockwiseArrow.onclick = RotationOnClick;
	var clockwiseArrow = document.createElement("div");
	clockwiseArrow.id = "clockwiseArrow";
	clockwiseArrow.className = "rotationArrow";
	clockwiseArrow.onmouseover = RotationOnHoverStart;
	clockwiseArrow.onmouseout = RotationOnHoverEnd;
	clockwiseArrow.onclick = RotationOnClick;

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