//Creating a rudimentary MVC-type configuration using vanilla JS

var view = {
	displayMessage: function (msg) {
		//display message on screen
		var messageArea = document.getElementById('message-area');
		messageArea.innerHTML = msg;
	},
	displayHit: function (location) {
		//change class of table cell to 'hit'
		var cell = document.getElementById(location);
		cell.setAttribute('class', 'hit');
	},
	displayMiss: function (location) {
		//change class of table cell to 'miss'
		var cell = document.getElementById(location);
		cell.setAttribute('class', 'miss');
	}
};

//Hard-coding values in the model for now for ease of testing
//Using properties for values such as the size of the board and the number of ships makes the game scalable if we want to change it later
var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [
		{
			locations: [0, 0, 0],
			hits: ['', '', '']
		}, 
		{
			locations: [0, 0, 0],
			hits: ['', '', '']
		}, 
		{
			locations: [0, 0, 0],
			hits: ['', '', '']
		}
	],
	collision: function (locations) {
		//takes a single ship
		//makes sure it doesn't overlap with a ship already on the board
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				//check to see if any of the locations in the new ship's locations array is in an existing ship location's array
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},
	generateShip: function () {
		//creates a single ship, somewhere on the board
		//locations may or may not overlap with other ships

		//result will be 0 or 1
		var direction = Math.floor(Math.random() * 2);
		var row;
		var col;
		var newShipLocations = [];

		//Generate starting cell on board
		//direction = 1: horizontal; direction = 0: vertical
		if (direction === 1) {
			//Generate starting location for horizontal ship
			row = Math.floor(Math.random() * this.boardSize);
			//since the ship is horizontal, we need to leave room for the rest of the ship
			//starting column must be between 0 - 4 (if higher it will go off the board)
			col = Math.floor(Math.random() * ((this.boardSize - this.shipLength) + 1));
		} else {
			//Generate vertical location
			//this time row needs to be a random location between 0 and 4 to leave room for the ship
			row = Math.floor(Math.random() * ((this.boardSize - this.shipLength) + 1));
			col = Math.floor(Math.random() * this.boardSize);

		}

		//Generate the rest of the cells
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				//add location to array for new horizontal ship
				//ensure that "i" is added to var col before it's converted to a string
				//quote marks ensure that the output is accomplished through string concatenation and not addition
				newShipLocations.push(row + '' + (col + i));
			} else {
				//add location to array for new vertical ship
				newShipLocations.push((row + i) + '' + col);
			}
		}

		return newShipLocations;

	},
	generateShipLocations: function () {
		//master method
		//creates a ships array in the model, with the number of ships in model.numShips property
		//each time it generates a new ship, uses the collision method to make sure no overlaps
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	fire: function (guess) {
		//fire on a ship and figure out if hit or miss
		//using this.numShips for scalability later (instead of hard-coding i < 3)
		//iterating through the ships, examining one ship at a time.
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];

			//The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.
			var index = ship.locations.indexOf(guess);

			if (index >= 0) {
				//Ship is hit
				ship.hits[index] = 'hit';
				view.displayHit(guess);
				view.displayMessage('HIT!');

				//call the isSunk method using the ship to find out if it's sunk
				if (this.isSunk(ship)) {
					this.shipsSunk++;
					view.displayMessage('You sank my battleship!');
				}
				return true;
			}
		}
		//return false if not a hit (index = -1) & display a miss
		view.displayMiss(guess);
		view.displayMessage('You missed.');
		return false;
	},
	isSunk: function (ship) {
		//take a particular ship and search each value of its 'hits' array.
		//then, if any of those values is not equal to 'hit,' return false: the ship isn't sunk.
		for (var i = 0; i < this.shipsLength; i++) {
			if (ship.hits[i] !== 'hit') {
				return false;
			}
		}
		return true;
	}
};

var controller = {
	guesses: 0,
	parseGuess: function (guess) {
		//Processes the guesses and passes them to the model. Detects the end of the game.
		var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
		var alertError = 'Please enter a letter and a number on the board between A' + (model.boardSize - 1) + ' and ' + alphabet[alphabet.length - 1] + (model.boardSize - 1);

		if (guess === null || guess.length !== 2) {
			alert(alertError);
		} else {
			//Get the first character of the guess, then assign var 'row' to that index of the alphabet array
			//change to uppercase to ensure lower-case input is accepted
			var firstChar = guess.charAt(0);
			firstChar = firstChar.toUpperCase();
			var row = alphabet.indexOf(firstChar);
			var column = guess.charAt(1);

			//validating user input
			if (isNaN(row) || isNaN(column)) {
				alert(alertError);
			} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
				alert(alertError);
			} else {
				return row + column;
			}
		}
		//return null if input not valid
		return null;
	},
	processGuess: function (guess) {
		var location = this.parseGuess(guess);

		//ensures we don't get null back, then increases the number of guesses and fires
		if (location) {
			this.guesses++;

			//returns true or false
			var hit = model.fire(location);

			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage('You sank all my battleships in ' + this.guesses + ' guesses!');
			}
		}
	}
};

//Event handlers

function init () {
	var fireButton = document.getElementById('fire-button');
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById('guess-input');
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
}

function handleFireButton () {
	//get value from form
	var guessInput = document.getElementById('guess-input');
	var guess = guessInput.value;

	//submit guess to the controller for processing
	controller.processGuess(guess);

	//reset the guess after submission
	guessInput.value = '';
}

function handleKeyPress (e) {
	var fireButton = document.getElementById('fire-button');
	if (e.keyCode === 13) {
		fireButton.click();
		//return false so that the form doesn't do anything else, like try to submit itself.
		return false;
	}
}

window.onload = init;



/**NOTES FOR LATER**/

/*********************************************************

~~~Prevent user from firing if model.shipsSunk === model.numShips~~~
~~~Don't allow the same guess more than once~~~
~~~Bug: It tells you that you sank all its battleships after you sink the first ship.~~~

*********************************************************/























