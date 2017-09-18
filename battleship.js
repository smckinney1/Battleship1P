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
		for (var i = 0; i < this.numShips, i++) {
			var ship = this.ships[i];
			var locations = ship.locations;

			//The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.
			var index = locations.indexOf(guess);
			if (index >= 0) {
				//Ship is hit
				ship.hits[index] = "hit";
				return true;
			}
			//return false if not a hit (index = -1)
			return false;
		}
	}
};













