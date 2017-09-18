//Creating a rudimentary MVC-type configuration using vanilla JS

var view = {
	displayMessage: function (msg) {
		//display message on screen
		var messageArea = document.getElementById("message-area");
		messageArea.innerHTML = msg;
	},
	displayHit: function (location) {
		//change class of table cell to "hit"
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function (location) {
		//change class of table cell to "miss"
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};