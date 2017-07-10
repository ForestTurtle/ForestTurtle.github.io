var players = [];
var currentPlayer = 0;
var numInfoTokens = 0;
var livesLeft = 0;
var ctx;

var deck = [];
var hands = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];
var table = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]; //red | blue | green | yellow | purple
var discard = [];

var hitAreas = [];

var menuHitFlag = false;

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
function initialize(canvasContext) {
	initializeDeck();
	initializeHands();
	livesLeft = 3;
	numInfoTokens = 8;
	initializeHitAreas();
	ctx = canvasContext;
}

/*
load the deck with 3 of each color 1, 2 of each color 2-4 and 1 of each color 5 
shuffles deck
*/
function initializeDeck() {
	createSuite("red");
	createSuite("purple");
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
		card = new Card(color,i);
		deck.push(card);
		if (i < 5) {
			deck.push(card);
			if (i == 1) {
				deck.push(card);
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
function initializeHands() {

	for (i = 0; i < 5; i++) {
		for (j = 0; j < hands.length; j++) {
			hands[j][i] = deck.pop();
		}
	}

}

//-----------------------------------------------

/*
player and card being the player number and the order of the card in his hand
*/
function draw(player, cardPos) {

	card = deck.pop();

	if (card == 'undefined') {
		//Game over condition triggered
	}

	hands[player][cardPos] = card;
}

function discardCard(player, cardPos) {

	if (numInfoTokens == 8) {
		//Prevent player from doing action
	}
	else {
    	discard.push(hands[player][cardPos]);
		draw(player,cardPos);
		numInfoTokens++;
	} 

}

/* 
Rearranges the array in order to move cards around in one's hand 
*/
function rearrange(player, cardPos, newPos) {

	temp = new Card(hands[player][cardPos].color,hands[player][cardPos].number);

	hands[player][cardPos] = hands[player][newPos];

	hands[player][newPos] = temp;
		
}

/*
Plays a card from one's hand to the board.
*/

function playCard(player,cardPos) {
	
	played = hands[player][cardPos];
  
	switch(played.color) {
	
	case 'red':
		evaluatePlayed(0,played,player,cardPos);
	    break;

	case 'blue':
		evaluatePlayed(1,played,player,cardPos);
		break;

	case 'green':
	  	evaluatePlayed(2,played,player,cardPos);
	   	break;

	case 'yellow':
	  	evaluatePlayed(3,played,player,cardPos);
	    break;

	case 'purple':
	  	evaluatePlayed(4,played,player,cardPos);
	    break;
	}
  
}

/*
Helper function for playCard which determines whether the move is valid or not
*/

function evaluatePlayed(tableNumber, played, player, cardPos) {

	if(typeof table[tableNumber][0] == 'undefined')
	{
  		if(played.number == 1)
    	{
			table[tableNumber][0] = played;
			draw(player,cardPos);
    	}	
    
    	else
    	{
    		livesLeft--;
		}
  	}
	else
	{
  		if(typeof table[tableNumber][played.number - 2] != 'undefined')
    	{
    		table[tableNumber][played.number-1] = played;
    		draw(player,cardPos);
    	}
    	else
    	{
    		livesLeft--;
    	}
  	}
}

/*the player to give info to*/
function giveInfoColor(color, player, cardPos) {
		
		var col = hands[player][cardPos].color;
		var info = "";
		for (i = 0 ; i < 5; i++) {
			if(hands[player][i].color == col)
			{
				info = info + "card " + (i+1) + "  "; 
			}
		}

		info = info + "is/are " + color;
		numInfoTokens--;
		alert(info);
 
}

function giveInfoNumber(number, player, cardPos) {
		
		var num = hands[player][cardPos].number;
		var info = "";
		for (i = 0 ; i < 5; i++) {
			if(hands[player][i].number == number)
			{
				info = info + "card " + (i+1) + "  "; 
			}
		}

		numInfoTokens--;
		info = info + "is/are " + number;
		alert(info);
}


//-----------------------------------------------

/*
renders the entire board
*/
function render() {
	//clear rect
	ctx.clearRect(0,0,200,200);
	drawUI();
	//draw player hands
	// for (var i = 0; i < numPlayers; i++) {
	// 	drawHand(i);
	// }
	drawTable();
	drawHand(0);
	drawHand(1);
	drawHand(2);
	drawHand(3);
	drawHand(4);


	drawLives(livesLeft);
	drawInfoCounter(numInfoTokens);
	drawDiscarded();

}

/*
draws the hand of the player selected
*/
function drawHand(player) {
	// var img = new Image();
	// img.src = "greenCard.jpg"
	// img.onload = function () {
	//     ctx.drawImage(img, 200, 200);
	//     ctx.font = '70px serif';
	//     ctx.fillText("5", 233, 310);
	// }

	var xPos = 0;
	var yPos = 0;

	switch(player){
		case 0: //Center
			xPos = 380;
			yPos = 450;
			break; 
		
		case 1: //Lower Left
			xPos = 100;
			yPos = 300;
			break;

		case 2: //Upper Left
			xPos = 100;
			yPos = 100;
			break;

		case 3: //Upper Right
			xPos = 700;
			yPos = 100;
			break;

		case 4: //Lower Right
			xPos = 700;
			yPos = 300;
			break;
	}

	//Center
	for(i = 0; i < 5; i++) {
		drawCard(hands[player][i].number, hands[player][i].color, xPos + (50*i), yPos, 0.4);
	}


}

function drawCard(num, color, x, y, scale) {
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
function drawTable() {

	//table arrays go in the order: red | blue | green | yellow | purple

	var colors = ['red','blue','green','yellow','purple']

	for (i = 0; i < 5; i++) {
		ctx.strokeStyle=colors[i];
		ctx.beginPath();
		ctx.rect(375 + (50*i),200,40,60);
		ctx.stroke(); 
	}

	for(i = 0; i < 5; i++){
		for(j = 0; j < 5; j++){
			if(typeof table[i][j] != 'undefined')
			{
				drawCard(table[i][j].number,table[i][j].color,375 + (50*i),200,0.4)

			}
		}

	}



}

/*
Draws the discarded pile to to screen (not all the cards, just the pile)
*/
function drawDiscarded() {
	ctx.fillRect(10,10,80,80);
}

/*
Draws all the cards in the discared pile
*/
function drawDiscardedCards(ct) {
	ctx.fillRect(100,10,80,80);
}

/*
draw all the static images
*/
function drawUI() {

	ctx.fillStyle = "#BFBFBF";
	ctx.beginPath();
	//x, y, r start angle, end angle
	ctx.arc(495,300,280,0,2*Math.PI);
	ctx.fill();



}

function drawInfoCounter(numInfoTokens) {
	var centerx = 100;
	var centery = 500;
	var radius = 40;

	ctx.fillStyle = "#ff047a";
	ctx.beginPath();
	//x, y, r start angle, end angle
	ctx.arc(centerx,centery,radius,0,2*Math.PI);
	ctx.fill();

	ctx.fillStyle = "#3bff3b";
	ctx.beginPath();
	//x, y, r start angle, end angle
	ctx.arc(centerx,centery,radius,0,(0.25*(numInfoTokens))*Math.PI);
	ctx.lineTo(centerx, centery);
	ctx.fill();

	ctx.fillStyle = "#000000";
}

/*
draws the bomb and string
*/
function drawLives(livesLeft) {

	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.arc(900,500,40,0,2*Math.PI);
	ctx.fill();

	ctx.font = "30px Arial"
	ctx.fillStyle = "red";	
	ctx.fillText(livesLeft,890,510)

	ctx.beginPath();
	ctx.bezierCurveTo(900,480-(30*livesLeft),900,480-(30*livesLeft),900,500);
	ctx.stroke();

}

//--------------------------------

/*

*/
function initializeHitAreas() {
	//the discard pile
	hitAreas.push(new HitArea(10, 10, 80, 80, function(){
		drawDiscardedCards();
		hitAreas.push(new HitArea(100, 10, 80, 80, function(){
			render();
			hitAreas.pop(); //assumes that this is the newest hit area and removes itself
		}));
	}));
	
	for(let i = 0; i < 5; i++){ //Change iterator to add players? 
		for(let j = 0; j < 5; j++){

			switch(i){
				case 0: //Center
					xPos = 380;
					yPos = 450;
					break; 
				
				case 1: //Lower Left
					xPos = 100;
					yPos = 300;
					break;

				case 2: //Upper Left
					xPos = 100;
					yPos = 100;
					break;

				case 3: //Upper Right
					xPos = 700;
					yPos = 100;
					break;

				case 4: //Lower Right
					xPos = 700;
					yPos = 300;
					break;
			}

			hitAreas.push(new HitArea(xPos + (50*j),yPos,40,60, function(){
				menuHitFlag = true;
				showOptionsOther(i,j);
			}));
		}
	}

//testingHit();
	

}

/*
Gives options for the player to give either discard or play their own cards.
*/

function showOptions(player,cardPos) {

	var xPos = 0;
	var yPos = 0;


	switch(player){
		case 0: //Center
			xPos = 380;
			yPos = 450;
			break; 
		
		case 1: //Lower Left
			xPos = 100;
			yPos = 300;
			break;

		case 2: //Upper Left
			xPos = 100;
			yPos = 100;
			break;

		case 3: //Upper Right
			xPos = 700;
			yPos = 100;
			break;

		case 4: //Lower Right
			xPos = 700;
			yPos = 300;
			break;
	}

	xPos = xPos + (50 * cardPos);

	var radius = 8;

	ctx.fillStyle = "#FDFEFE";

	ctx.beginPath();
	ctx.arc(xPos+10,yPos-20,radius,0,2*Math.PI);
	ctx.fill();

	ctx.arc(xPos+30,yPos-20,radius,0,2*Math.PI);
	ctx.fill();

	
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";	
	ctx.fillText("X",xPos+5,yPos-14);
	ctx.fillText("P",xPos+25,yPos-14);

	hitAreas.push(new HitArea(xPos,yPos-30,20,20, function(){ //Hit area for discard card

		discardCard(player,cardPos);
		render();
		// hitAreas.pop();
		// hitAreas.pop();


	}));

	hitAreas.push(new HitArea(xPos+20,yPos-30,20,20, function(){ //Hit area for play card

		playCard(player,cardPos);
		render();
		// hitAreas.pop();
		// hitAreas.pop();

	}));

}

/*
Gives options for the player to give information on another player's card.
*/

function showOptionsOther(player,cardPos) {

	var xPos = 0;
	var yPos = 0;


	switch(player){
		case 0: //Center
			xPos = 380;
			yPos = 450;
			break; 
		
		case 1: //Lower Left
			xPos = 100;
			yPos = 300;
			break;

		case 2: //Upper Left
			xPos = 100;
			yPos = 100;
			break;

		case 3: //Upper Right
			xPos = 700;
			yPos = 100;
			break;

		case 4: //Lower Right
			xPos = 700;
			yPos = 300;
			break;
	}

	xPos = xPos + (50 * cardPos);

	var radius = 8;

	ctx.fillStyle = "#FDFEFE";

	ctx.beginPath();
	ctx.arc(xPos+10,yPos-20,radius,0,2*Math.PI);
	ctx.fill();

	ctx.arc(xPos+30,yPos-20,radius,0,2*Math.PI);
	ctx.fill();

	
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";	
	ctx.fillText("C",xPos+5,yPos-14);
	ctx.fillText("#",xPos+25,yPos-14);

	hitAreas.push(new HitArea(xPos,yPos-30,20,20, function(){ //Hit area for give info on color

		giveInfoColor(hands[player][cardPos].color, player, cardPos); 

	}));

	hitAreas.push(new HitArea(xPos+20,yPos-30,20,20, function(){ //Hit area for give info on number

		giveInfoNumber(hands[player][cardPos].number, player, cardPos); 
	}));

}

function normalCollision(x,y) {

	hitAreas.forEach(function(item, index) {
		ctx.strokeStyle="red";
		ctx.beginPath();
		ctx.rect(item.x,item.y,item.w,item.h);
		ctx.stroke(); 
		
		if (collides(x, y, item)){
			//alert("normal collision : collided with hitbox");
			item.action();
		}

	});

}

// function menuCollision(x,y){

// 	var notInHitbox = false;
// 	hitAreas.forEach(function(item, index) {

// 		ctx.strokeStyle="red";
// 		ctx.beginPath();
// 		ctx.rect(item.x,item.y,item.w,item.h);
// 		ctx.stroke(); 


// 		if (collides(x, y, item)){

// 				if((item == hitAreas[hitAreas.length-2] || item == hitAreas[hitAreas.length-1]))
// 				{ 
// 					//alert("menu collision : collided with hitbox: hit option");
// 					item.action();
// 					hitAreas.pop();
// 					hitAreas.pop();
// 					render();
// 				}
// 				else
// 				{
// 					hitAreas.pop();
// 					hitAreas.pop();
// 					render();
// 				}

// 		}
// 		else
// 		{
// 			notInHitbox = true;
// 		}
// 	});

// 	if(notInHitbox == true)
// 	{
// 		hitAreas.pop();
// 		hitAreas.pop();
// 		render();
// 	}

// }

/*
loop through the hit areas are does the apprpriate action. The control
*/
// function checkForHit(x, y) {
// 	if(menuHitFlag == true)
// 	{
// 		menuCollision(x,y);
// 		menuHitFlag = false;
// 	}
// 	else
// 	{
// 		normalCollision(x,y);
// 	}
// }
/*
loop through the hit areas are does the apprpriate action. The control
*/
function checkForHit(x, y) {
	if(menuHitFlag == true)
	{
		menuHitFlag = false;
		normalCollision(x,y);
		console.log(menuHitFlag);
		if(menuHitFlag == true){
			//remote index 2 and 3
			hitAreas.splice(-3, 2);
		} else {
	 		hitAreas.pop();
			hitAreas.pop();
		}
	} else {
		normalCollision(x,y);
	}
	// render();
}


//is a point in a rect?
function collides(xp, yp, hitArea) {
	if (hitArea.x < xp && hitArea.x+hitArea.w > xp) {
		if (hitArea.y < yp && hitArea.y+hitArea.h > yp) {
			return true;
		}
	}
	return false;
}

//check to see if game ended
function isGameOver() {
	return false;
}

//calculates and returns the current score
function getScore() {
	return 0;
}

function testingHit()
{
	for(i = 0; i < hitAreas.length;i++)
	{
		console.log(hitAreas[i]);
	}
}

