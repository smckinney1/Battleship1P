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
	shipsLength: 3,
	shipsSunk: 0,
	ships: [
		{
			locations: ['06', '16', '26'],
			hits: ['', '', '']
		}, 
		{
			locations: ['24', '34', '44'],
			hits: ['', '', '']
		}, 
		{
			locations: ['10', '11', '12'],
			hits: ['', '', 'hit']
		}
	],
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

Converting the guess to numeric form:

(1) Assume we've been handed a string in alphanumeric form
(2) Separate the string's two letters
(3a) The second character in the string should be converted to a number and ensure it's between 0 and 6
(3b) The first character in the string should be converted to a number and ensure it is between 0 and 6
(4) Put the two numbers back together into a string.

Possibly a better method than using an array for the alphabet:

var alphabet = {
	A: 0,
	B: 1,
	C: 2,
	D: 3,
	E: 4,
	F: 5,
	G: 6
}

var guess = 'A3';
var guessSplit = guess.split('');

if (alphabet.hasOwnProperty(guessSplit[0])) {
	guessSplit[0] = alphabet[guessSplit[0]];
	console.log(guessSplit[0]);
} else {
	//view.displayMessage('Your guess is invalid. Try again.');
	return false;
}

guess = guessSplit.join('');

if (guess < 0 || guess > 66) {
	//view.displayMessage('Your guess is invalid. Try again.');
	return false;
}

*********************************************************/























