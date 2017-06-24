numPlayers = 0;
numInfoTokens = 0;
livesLeft = 0;

deck = [];
hands = [[]];
discard = [];
table = [new array(5), new array(5), new array(5), new array(5), new array(5)];

class Card {
	constructor(color, number){
		this.color = color;
		this.number = number;
	}
}

//-----------------------------------------------

/*
called at the beginning of every game to start it up
*/
function initialize(){
	initializeDeck();
	initializeHands();
}

/*
load the deck with 3 of each color 1, 2 of each color 2-4 and 1 of each color 5 
shuffles deck
*/
function initializeDeck(){

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

function drawLine(ctx){
	ctx.moveTo(0,0);
	ctx.lineTo(200,100);
	ctx.stroke(); 
}

/*
renders the entire board
*/
function render(ctx){
	//draw player hands
	for (var i = 0; i < numPlayers; i++) {
		drawHand(i);
	}
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
Draws the discarded pile to to screen
*/
function drawDiscarded(){

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