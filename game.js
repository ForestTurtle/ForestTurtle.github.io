class Game {

	constructor(canvasContext){
		this.players = [];
		this.currentPlayer = 0;
		this.numInfoTokens = 8;
		this.livesLeft = 3;
		this.ctx = canvasContext;

		this.deck = [];
		this.hands = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];
		this.table = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]; //red | blue | green | yellow | purple
		this.discard = [];

		this.hitAreas = [];

		this.menuHitFlag = false;

		this.dynamicDrawables = [];

		this.initializeDeck(deck);
		this.initializeHands(hands);
		this.initializeHitAreas();
	}


//-----------------------------------------------

/*
load the deck with 3 of each color 1, 2 of each color 2-4 and 1 of each color 5 
shuffles deck
*/
initializeDeck(deck) {
	this.createSuite("red", deck);
	this.createSuite("purple", deck);
	this.createSuite("blue", deck);
	this.createSuite("green", deck);
	this.createSuite("yellow", deck);

	deck = shuffle(deck);
}

/*
adds a specific color to the deck
*/
createSuite(color, deck) {
	for (i = 1; i < 6; i++) {
		let card = new Card(color,i);
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
shuffle(array) {
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
initializeHands(hands) {
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
draw(player, cardPos, hands) {
	let card = deck.pop();

	if (card == 'undefined') {
		//Game over condition triggered
	}

	hands[player][cardPos] = card;
}

discardCard(player, cardPos, hands, discard) {
	if (this.numInfoTokens == 8) {
		//Prevent player from doing action
	}
	else {
    	discard.push(hands[player][cardPos]);
		this.draw(player,cardPos, hands);
		this.numInfoTokens++;
	} 
}

/* 
Rearranges the array in order to move cards around in one's hand 
*/
rearrange(player, cardPos, newPos) {
	temp = new Card(hands[player][cardPos].color,hands[player][cardPos].number);

	hands[player][cardPos] = hands[player][newPos];

	hands[player][newPos] = temp;
}

/*
Plays a card from one's hand to the board.
*/

playCard(player,cardPos) {
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

evaluatePlayed(tableNumber, played, player, cardPos) {
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
giveInfoColor(color, player, cardPos) {
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

giveInfoNumber(number, player, cardPos) {
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
render() {
	//clear rect
	ctx.clearRect(0,0,1000,600);
	drawUI();
	drawTable();
	//draw player hands
	for (let i = 0; i < 5; i++) {
		drawHand(i);
	}

	drawLives(livesLeft);
	drawInfoCounter(numInfoTokens);
	drawDiscarded();

	dynamicDrawables.forEach(function(item) {
		item.draw();
	});

}

/*
draws the hand of the player selected
*/
drawHand(player) {
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

drawCard(num, color, x, y, scale) {
	var img = new Image();
	img.src = color+"Card.jpg"
	img.onload = function () {
		ctx.drawImage(img, x, y, 100*scale, 150*scale);
		ctx.font = 70*scale+'px serif';
		ctx.fillStyle = 'black';
		ctx.fillText(num, x+33*scale, y+110*scale);
	}
}

/*
draws the table in the middle
*/
drawTable() {
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
drawDiscarded() {
	ctx.fillRect(10,10,80,80);
}

/*
Draws all the cards in the discared pile
*/
drawDiscardedCards(ct) {
	ctx.fillRect(100,10,80,80);
}

/*
draw all the static images
*/
drawUI() {
	ctx.fillStyle = "#BFBFBF";
	ctx.beginPath();
	//x, y, r start angle, end angle
	ctx.arc(495,300,280,0,2*Math.PI);
	ctx.fill();
}

drawInfoCounter(numInfoTokens) {
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
drawLives(livesLeft) {
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
initializeHitAreas() {
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
				showAllyOptions(i,j);
			}));
		}
	}
}

/*
Gives options for the player to give either discard or play their own cards.
*/

showPlayerOptions(player,cardPos) {
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
	}));

	hitAreas.push(new HitArea(xPos+20,yPos-30,20,20, function(){ //Hit area for play card
		playCard(player,cardPos);
	}));
}

/*
Gives options for the player to give information on another player's card.
*/

showAllyOptions(player,cardPos) {
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

	dynamicDrawables.push(new DynamicDrawable(function (){
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(xPos+10,yPos-20,radius,0,2*Math.PI);
		ctx.fill();
		ctx.fillStyle = "#FDFEFE";
		ctx.font = "16px Arial";
		ctx.fillText("C",xPos+5,yPos-14);
	}));

	dynamicDrawables.push(new DynamicDrawable(function (){
		ctx.fillStyle = "black";	
		ctx.beginPath();
		ctx.arc(xPos+30,yPos-20,radius,0,2*Math.PI);
		ctx.fill();
		ctx.fillStyle = "#FDFEFE";
		ctx.font = "16px Arial";
		ctx.fillText("#",xPos+25,yPos-14);
	}));

	hitAreas.push(new HitArea(xPos,yPos-30,20,20, function(){ //Hit area for give info on color
		giveInfoColor(hands[player][cardPos].color, player, cardPos); 
	}));

	hitAreas.push(new HitArea(xPos+20,yPos-30,20,20, function(){ //Hit area for give info on number
		giveInfoNumber(hands[player][cardPos].number, player, cardPos); 
	}));
}

/*
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


loop through the hit areas are does the apprpriate action. The control
*/
/*
function checkForHit(x, y) {
	if(menuHitFlag == true) //card menus are open
	{
		menuHitFlag = false;
		normalCollision(x,y);
		//console.log(menuHitFlag);
		if(menuHitFlag == true){ //clicked card
			//remove 3rd and 3th last added things
			hitAreas.splice(-4, 2);
			dynamicDrawables.splice(-4,2);
		} else { //clicked elsewhere
	 		hitAreas.pop();
			hitAreas.pop();
			dynamicDrawables.pop();
			dynamicDrawables.pop();
		}
	} else {
		normalCollision(x,y);
	}
	render();
}
*/


/*
loop through the hit areas are does the apprpriate action. The control
*/
checkForHit(x, y) {
	var clickAction = function (){};
	hitAreas.forEach(function(item, index) {
		ctx.strokeStyle="red";
		ctx.beginPath();
		ctx.rect(item.x,item.y,item.w,item.h);
		ctx.stroke(); 
		
		if (collides(x, y, item)){
			clickAction = item.action;
		}
	});

	//can later make it something like: hitAreasToRemove and drawAreasToRemove and make it a loop
	if (menuHitFlag){
 		hitAreas.pop();
		hitAreas.pop();
		dynamicDrawables.pop();
		dynamicDrawables.pop();
	}
	clickAction();
	render();
}



//is a point in a rect?
collides(xp, yp, hitArea) {
	if (hitArea.x < xp && hitArea.x+hitArea.w > xp) {
		if (hitArea.y < yp && hitArea.y+hitArea.h > yp) {
			return true;
		}
	}
	return false;
}

//check to see if game ended
isGameOver() {
	return false;
}

//calculates and returns the current score
getScore() {
	return 0;
}

testingHit()
{
	for(i = 0; i < hitAreas.length;i++)
	{
		console.log(hitAreas[i]);
	}
}

}