var numPlayers = 0;
var numInfoTokens = 0;
var livesLeft = 0;
var ctx;

var deck = [];
var table = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];
var discard = [];
var table = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];

var hitAreas = [];

class Card {
	constructor(color, number){
		this.color = color;
		this.number = number;
	}
}

class HitArea {
	constructor(x, y, w, h, action){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.action = action;
	}
}

//-----------------------------------------------

/*
called at the beginning of every game to start it up
*/
function initialize(canvasContext){
	// initializeDeck();
	// initializeHands();
	initializeHitAreas();
	ctx = canvasContext;
}

/*
load the deck with 3 of each color 1, 2 of each color 2-4 and 1 of each color 5 
shuffles deck
*/
function initializeDeck(){

	createSuite("red");
	createSuite("white");
	createSuite("blue");
	createSuite("green");
	createSuite("yellow");

	deck = shuffle(deck);

}

/*
adds a specific color to the deck
*/

function createSuite(color) {
	for (i = 1; i < 6; i++) {
		c = new Card(color,i);
		deck.push(c);
		if (i < 5){
			deck.push(c);
			if(i == 1){
				deck.push(c);
			}
		}
	}
}

/*
Shamelessly stolen array shuffling code 
*/

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
draw the correct number of cards to each players hands
*/
function initializeHands(){

}

//-----------------------------------------------

/*
player and card being the player number and the order of the card in his hand
*/
function drawCard(player, cardPos){

}

function discardCard(player, cardPos){

}

function rearrange(player, cardPos, newPos){

}

function playCard(player, cardPos){

}

/*the player to give info to*/
function giveInfo(player, cardNo, color){

}

//-----------------------------------------------


function drawLine(){
	ctx.moveTo(0,0);
	ctx.lineTo(200,100);
	ctx.stroke(); 
}

/*
renders the entire board
*/
function render(){
	//draw player hands
	for (var i = 0; i < numPlayers; i++) {
		drawHand(i);
	}
	drawDiscarded();
}

/*
draws the hand of the player selected
*/
function drawHand(player){

}

/*
draws the table in the middle
*/
function drawTable(){

}

/*
Draws the discarded pile to to screen (not all the cards, just the pile)
*/
function drawDiscarded(){
	ctx.fillRect(10,10,80,80);
}

/*
Draws all the cards in the discared pile
*/
function drawDiscardedCards(ct){
	ctx.fillRect(100,10,80,80);
}

/*
draw all the static images
*/
function drawUI(){

}

function drawInfoCounter() {

}

/*
draws the bomb and string
*/
function drawLives(){

}

//--------------------------------

/*

*/
function initializeHitAreas(){
	//the discard pile
	hitAreas.push(new HitArea(10, 10, 80, 80, function(){
		drawDiscardedCards();
	}));
}

/*
loop through the hit areas are does the apprpriate action. The control
*/
function checkForHit(x, y){
	for (var i = 0; i < hitAreas.length; i++) {
		if (collides(hitAreas[i])){
			hitAreas[i].action();
		}
	}
}

//is a point in a rect?
function collides(xp, yp, x, y, w, h){
	if (x < xp && x+w > xp) {
		if (y < yp && y+h > yp) {
			return true;
		}
	}
	return false;
}