//-----------------------------------------------

/*
renders the entire board
*/
function render(ctx, game) {
	//clear rect
	ctx.clearRect(0,0,1000,600);
	drawUI(ctx);
	drawTable(game.table, ctx);
	//draw player hands
	for (let i = 0; i < 5; i++) {
		drawHand(i, ctx, game.hands);
	}

	drawLives(game.livesLeft, ctx);
	drawInfoCounter(game.numInfoTokens, ctx);
	drawDiscarded(ctx);

	game.dynamicDrawables.forEach(function(item) {
		item.draw(ctx);
	});
}

/*
draws the hand of the player selected
*/
function drawHand(player, ctx, hands) {
	let xPos = 0;
	let yPos = 0;

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
	for(let i = 0; i < 5; i++) {
		drawCard(hands[player][i].number, hands[player][i].color, xPos + (50*i), yPos, 0.4, ctx);
	}
}

function drawCard(num, color, x, y, scale, ctx) {
	let img = new Image();
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
function drawTable(table, ctx) {
	//table arrays go in the order: red | blue | green | yellow | purple

	let colors = ['red','blue','green','yellow','purple']

	for (let i = 0; i < 5; i++) {
		ctx.strokeStyle=colors[i];
		ctx.beginPath();
		ctx.rect(375 + (50*i),200,40,60);
		ctx.stroke(); 
	}

	for(let i = 0; i < 5; i++){
		for(let j = 0; j < 5; j++){
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
function drawDiscarded(ctx) {
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.rect(10,10,60,80);
	ctx.stroke();

	ctx.font = "16px Arial"
	ctx.fillStyle = "black";	
	ctx.fillText("Discard",14,50);
}

/*
Draws all the cards in the discared pile
*/
function drawDiscardedCards(ctx) {

	alert("asdf");


}

/*
draw all the static images
*/
function drawUI(ctx) {
	ctx.fillStyle = "#BFBFBF";
	ctx.beginPath();
	//x, y, r start angle, end angle
	ctx.arc(495,300,280,0,2*Math.PI);
	ctx.fill();
}

function drawInfoCounter(numInfoTokens, ctx) {
	let centerx = 100;
	let centery = 500;
	let radius = 40;

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
function drawLives(livesLeft, ctx) {
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