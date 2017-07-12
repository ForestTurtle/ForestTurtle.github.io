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


		//this.menuHitFlag = false;


		this.initializeDeck(this.deck);
		this.initializeHands(this.hands, this.deck);
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

		deck = this.shuffle(deck);
	}

	/*
	adds a specific color to the deck
	*/
	createSuite(color, deck) {
		for (let i = 1; i < 6; i++) {
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
	  let currentIndex = array.length, temporaryValue, randomIndex;

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
	initializeHands(hands, deck) {
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < hands.length; j++) {
				hands[j][i] = deck.pop();
			}
		}
	}

	//check to see if game ended
	isGameOver() {
		return false;
	}

	//calculates and returns the current score
	getScore() {
		return 0;
	}

	//-----------------------------------------------

	/*

	//player and card being the player number and the order of the card in his hand

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
	*/

	 
	//Rearranges the array in order to move cards around in one's hand 
	/*
	rearrange(player, cardPos, newPos, hands) {
		temp = new Card(hands[player][cardPos].color,hands[player][cardPos].number);

		hands[player][cardPos] = hands[player][newPos];

		hands[player][newPos] = temp;
	}*/

	/*
	Plays a card from one's hand to the board.
	*/
	/*
	playCard(player, cardPos, hands) {
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
	*/


	/*
	Helper function for playCard which determines whether the move is valid or not
	*/
	/*
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
	*/


	/*the player to give info to*/
	giveInfoColor(color, player, cardPos, hands) {
		let col = hands[player][cardPos].color;
		let info = "";
		for (let i = 0 ; i < 5; i++) {
			if(hands[player][i].color == col)
			{
				info = info + "card " + (i+1) + "  "; 
			}
		}

		info = info + "is/are " + color;
		this.numInfoTokens--;
		alert(info);
	}

	giveInfoNumber(number, player, cardPos, hands) {
		let num = hands[player][cardPos].number;
		let info = "";
		for (let i = 0 ; i < 5; i++) {
			if(hands[player][i].number == number)
			{
				info = info + "card " + (i+1) + "  "; 
			}
		}

		this.numInfoTokens--;
		info = info + "is/are " + number;
		alert(info);
	}
}