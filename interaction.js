let hitAreas = [];
let hitAreasToRemove = 0;
let drawAreasToRemove = 0;
/*
Gives options for the player to give either discard or play their own cards.
*/
/*
showPlayerOptions(player,cardPos) {
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

	xPos = xPos + (50 * cardPos);

	let radius = 8;

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
*/
/*
Gives options for the player to give information on another player's card.
*/
function showAllyOptions(player, cardPos, hands) {
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

	xPos = xPos + (50 * cardPos);
	let radius = 8;

	dynamicDrawables.push(new DynamicDrawable(function (ctx){
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(xPos+10,yPos-20,radius,0,2*Math.PI);
		ctx.fill();
		ctx.fillStyle = "#FDFEFE";
		ctx.font = "16px Arial";
		ctx.fillText("C",xPos+5,yPos-14);
	}));
	drawAreasToRemove++;

	dynamicDrawables.push(new DynamicDrawable(function (ctx){
		ctx.fillStyle = "black";	
		ctx.beginPath();
		ctx.arc(xPos+30,yPos-20,radius,0,2*Math.PI);
		ctx.fill();
		ctx.fillStyle = "#FDFEFE";
		ctx.font = "16px Arial";
		ctx.fillText("#",xPos+25,yPos-14);
	}));
	drawAreasToRemove++;

	hitAreas.push(new HitArea(xPos,yPos-30,20,20, function(game){ //Hit area for give info on color
		game.giveInfoColor(hands[player][cardPos].color, player, cardPos, hands); 
	}));
	hitAreasToRemove++;

	hitAreas.push(new HitArea(xPos+20,yPos-30,20,20, function(game){ //Hit area for give info on number
		game.giveInfoNumber(hands[player][cardPos].number, player, cardPos, hands); 
	}));
	hitAreasToRemove++;
}

function initializeHitAreas() {
	//the discard pile
	hitAreas.push(new HitArea(10, 10, 80, 80, function(game){		
		dynamicDrawables.push(new DynamicDrawable(function (ctx){
			drawDiscardedCards(ctx);
		}));
		drawAreasToRemove++;

		hitAreas.push(new HitArea(100, 10, 80, 80, function(game){	
			hitAreas.pop(); //assumes that this is the newest hit area and removes itself
		}));
		hitAreasToRemove++;
	}));
	initializeCardHitboxes();
}

function initializeCardHitboxes(){
	for(let player = 0; player < 5; player++){ //Change iterator to add players? 
		for(let card = 0; card < 5; card++){

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

			hitAreas.push(new HitArea(xPos + (50*card),yPos,40,60, function(game){
				showAllyOptions(player, card, game.hands);
			}));
		}
	}
}
/*
loop through the hit areas are does the apprpriate action. The control
*/
function checkForHit(x, y, game) {
	let clickAction = function (){};

	hitAreas.forEach(function(item, index) {
		// no longer works
		// dynamicDrawables.push(new DynamicDrawable(function (ctx){
		// 	ctx.strokeStyle="red";
		// 	ctx.beginPath();
		// 	ctx.rect(item.x,item.y,item.w,item.h);
		// 	ctx.stroke(); 
		// }));

		if (collides(x, y, item)){
			clickAction = item.action;
		}
	});

	for (let i = hitAreasToRemove; i > 0 ; i--) {
		hitAreas.pop()
		hitAreasToRemove--;
	}

	for (let i = drawAreasToRemove; i > 0 ; i--) {
		dynamicDrawables.pop();
		drawAreasToRemove--;
	}
	clickAction(game);
}



//is a point in a rect?
function collides(xp, yp, rect) {
	if (rect.x < xp && rect.x+rect.w > xp) {
		if (rect.y < yp && rect.y+rect.h > yp) {
			return true;
		}
	}
	return false;
}