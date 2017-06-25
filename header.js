var numPlayers = 0;
var numInfoTokens = 0;
var livesLeft = 0;
var ctx;

var deck = [];
var hands = [new Array(5), new Array(5), new Array(5), new Array(5)];
var table = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];
var discard = [];

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

	for(i = 0; i < 5; i++)
	{
		for(j = 0; j < hands.length; j++)
	 	{
			hands[j][i] = deck.pop();
		}
	}

}

//-----------------------------------------------

/*
player and card being the player number and the order of the card in his hand
*/
function drawCard(player, cardPos){

	c = deck.pop();

	if(c == 'undefined')
	{
		//Game over condition triggered
	}

	hands[player][cardPos] = c;
}

function discardCard(player, cardPos){

	if(numInfoTokens == 8)
	{
		//Prevent player from doing action
	}
	else
	{
    	discard.push(hands[player][cardPos]);
		drawCard(player,cardPos);
		numInfoTokens++;
	} 

}

function rearrange(player, cardPos, newPos){

	temp = new Card(hands[player][cardPos].color,hands[player][cardPos].number);

	hands[player][cardPos] = hands[player][newPos];

	hands[player][newPos] = temp;
		
}

function playCard(player, cardPos){

}

/*the player to give info to*/
function giveInfo(player, cardNo, color){

}

//-----------------------------------------------

/*
renders the entire board
*/
function render(){
	//clear rect
	ctx.clearRect(0,0,200,200);

	drawUI();
	//draw player hands
	// for (var i = 0; i < numPlayers; i++) {
	// 	drawHand(i);
	// }
	drawHand(1);
	drawInfoCounter();
	drawLives();
	drawDiscarded();
	drawTable();
}

/*
draws the hand of the player selected
*/
function drawHand(player){
	// var img = new Image();
	// img.src = "greenCard.jpg"
	// img.onload = function () {
	//     ctx.drawImage(img, 200, 200);
	//     ctx.font = '70px serif';
	//     ctx.fillText("5", 233, 310);
	// }
	drawCard(1, 'green', 200, 200, 1);
	drawCard(2, 'blue', 350, 200, 2);
	drawCard(2, 'red', 600, 200, .75);
}

function drawCard(num, color, x, y, scale){
	var img = new Image();
	img.src = color+"Card.jpg"
	img.onload = function () {
		ctx.drawImage(img, x, y, 100*scale, 150*scale);
		ctx.font = 70*scale+'px serif';
		ctx.fillText(num, x+33*scale, y+110*scale);
	}
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
	var centerx = 100;
	var centery = 300;
	var radius = 40;

	ctx.fillStyle = "#3bff3b";
	ctx.beginPath();
	//x, y, r start angle, end angle
	ctx.arc(centerx,centery,radius,0,2*Math.PI);
	ctx.fill();

	ctx.fillStyle = "#ff047a";
	ctx.beginPath();
	//x, y, r start angle, end angle
	ctx.arc(centerx,centery,radius,0,1.75*Math.PI);
	ctx.lineTo(centerx, centery);
	ctx.fill();

	ctx.fillStyle = "#000000";
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
		hitAreas.push(new HitArea(100, 10, 80, 80, function(){
			render();
			hitAreas.pop(); //assumes that this is the newest hit area and removes itself
		}));
	}));
}

/*
loop through the hit areas are does the apprpriate action. The control
*/
function checkForHit(x, y){
	hitAreas.forEach(function(item, index){
		if (collides(x, y, item)){
			item.action();

		}
	});
}

//is a point in a rect?
function collides(xp, yp, hitArea){
	if (hitArea.x < xp && hitArea.x+hitArea.w > xp) {
		if (hitArea.y < yp && hitArea.y+hitArea.h > yp) {
			return true;
		}
	}
	return false;
}