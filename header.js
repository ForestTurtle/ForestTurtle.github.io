var canvasRect;
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
function initialize(canvas){
	canvasRect = canvas.getBoundingClientRect();
	initializeDeck();
	initializeHands();
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
Creates Card objects that populate the deck accordingly. There's probably a nicer way to do this but eh.
*/

function createSuite(color) {
  for (i = 1; i < 6; i++)
  {
    if(i == 1)
    {
         c = new Card(color,i);
         deck.push(c);
         deck.push(c);
         deck.push(c);
    }
    else if(i == 2)
    {
         c = new Card(color,i);
         deck.push(c);
         deck.push(c);
    }
    else if (i == 3)
    {
         c = new Card(color,i);
         deck.push(c);
         deck.push(c);
    }
    else if (i == 4)
    {

         c = new Card(color,i);
         deck.push(c);
         deck.push(c);
    }
    else
    {

         c = new Card(color,i);
         deck.push(c);
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
function drawHand(player, ctx){

}

/*
draws the table in the middle
*/
function drawTable(ctx){

}

/*
Draws the discarded pile to to screen
*/
function drawDiscarded(ctx){

}

/*
draw all the static images
*/
function drawUI(ctx){

}

function drawInfoCounter(ctx) {

}

/*
draws the bomb and string
*/
function drawLives(ctx){

}