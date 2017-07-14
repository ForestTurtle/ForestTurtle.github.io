class Game {

	constructor(numPlayers){
		this.players = [new User("Player")];
		for (let i = 1; i < numPlayers; i++) {
			this.players.push(new User("cpu" + i));
		}
		this.currentPlayer = 0;
		this.numInfoTokens = 4;
		this.livesLeft = 3;
		this.overTurns = 0; 

		this.deck = [];
		this.hands = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];
		this.table = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]; //red | blue | green | yellow | purple
		this.discardedCards = [];//new Card('red',1), new Card('blue',5)];

		this.initializeDeck(this.deck);
		this.initializeHands(this.hands, this.deck);
	}


	//-----------------------------------------------

	/*
	load the deck with 3 of each color 1, 2 of each color 2-4 and 1 of each color 5 
	shuffles deck
	*/
	initializeDeck(deck) {
		let cardColors = ["red", "purple", "blue", "green", "yellow"];

		cardColors.forEach(function(color){
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
		});
		deck = this.shuffle(deck);
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
			for (let j = 0; j < this.players.length; j++) {
				hands[j][i] = deck.pop();
			}
		}
	}

	//check to see if game ended
	isGameOver() {
		//person who draws last card gets one more turn
		//increment overTurns when increments currentPlayer and deck is empty
		return (this.livesLeft < 1 || (this.deck.length < 1 && this.overTurns > this.players.length));
	}

	//calculates and returns the current score
	getScore() {
		let score = 0;
		for(let color = 0; color < 5; color++){
			for(let number = 0; number < 5; number++){
				if(this.table[color][number])
				{
					score++;
				}
			}
		}
		return score;
	}


	/*the player to give info to*/
	giveInfoColor(player, cardPos) {
		if (this.numInfoTokens > 0) {	
			let col = this.hands[player][cardPos].color;
			let info = "";
			for (let i = 0 ; i < 5; i++) {
				if(this.hands[player][i] && this.hands[player][i].color == col)
				{
					info = info + "card " + (i+1) + "  "; 
				}
			}

			info += "of " + this.players[player].name;
			info = info + " is/are " + col;
			this.numInfoTokens--;
			if (this.deck.length < 1) {
				this.overTurns++;
			}
			this.currentPlayer = (this.currentPlayer+1)%this.players.length;
			// alert(info);
			return(info);
		}
	}

	giveInfoNumber(player, cardPos) {
		if (this.numInfoTokens > 0) {	
			let number = this.hands[player][cardPos].number;
			let info = "";
			for (let i = 0 ; i < 5; i++) {
				if(this.hands[player][i] && this.hands[player][i].number == number)
				{
					info = info + "card " + (i+1) + "  "; 
				}
			}

			this.numInfoTokens--;
			info += "of " + this.players[player].name;
			info = info + " is/are " + number;
			if (this.deck.length < 1) {
				this.overTurns++;
			}
			this.currentPlayer = (this.currentPlayer+1)%this.players.length;
			return(info);
		}
	}

	/*
	player and card being the player number and the order of the card in his hand
	does nothing if at full info tokens
	*/
	discardForInfo(player, cardPos) {
		if (this.numInfoTokens == 8) {
			//Prevent player from doing action
			//return false;
		} else {
			let card = this.hands[player][cardPos].color +" "+ this.hands[player][cardPos].number;
			this.discard(player,cardPos);
			this.numInfoTokens++;
			if (this.deck.length < 1) {
				this.overTurns++;
			}
			this.currentPlayer = (this.currentPlayer+1)%this.players.length;
			return ("discarded " + card + " from " + this.players[player].name);
		} 
	} 

	/*
	Plays a card from one's hand to the board and draws a card.
	If the card is valid, it gets added to the table
	If the card is invalid, it gets dsicarded and a life is subtracted
	*/
	playCard(player, cardPos) {
		let played = this.hands[player][cardPos];
		let card = this.hands[player][cardPos].color +" "+ this.hands[player][cardPos].number;
	  
		switch(played.color) {
		
		case 'red':
			this.evaluatePlayed(0,played,player,cardPos);
		    break;

		case 'blue':
			this.evaluatePlayed(1,played,player,cardPos);
			break;

		case 'green':
		  	this.evaluatePlayed(2,played,player,cardPos);
		   	break;

		case 'yellow':
		  	this.evaluatePlayed(3,played,player,cardPos);
		    break;

		case 'purple':
		  	this.evaluatePlayed(4,played,player,cardPos);
		    break;
		} 
		if (this.deck.length < 1) {
			this.overTurns++;
		}
		this.currentPlayer = (this.currentPlayer+1)%this.players.length;
		return ("played " + card + " from " + this.players[player].name);
	}

	/*
	helper methods for moving a card from the deck to the hand. if the deck is empty, then does nothing
	*/
	draw(player, cardPos) {
		let card = this.deck.pop();
		//alert(card.color);
		if (card == 'undefined') {
			//todo: Game over condition triggered
		}
		this.hands[player][cardPos] = card;
	}
	
	/*
	helper method for moving a card to the discard pile. if the card doesn't exist, does nothing
	*/
	discard(player, cardPos)
	{
		if(this.hands[player][cardPos]){
			this.discardedCards.push(this.hands[player][cardPos]);
			delete this.hands[player][cardPos];
			this.draw(player,cardPos);
		}
	}

	/*
	Helper function for playCard which determines whether the move is valid or not
	*/
	evaluatePlayed(tableNumber, played, player, cardPos) {
		if(!this.table[tableNumber][0])
		{
	  		if(played.number == 1)
	    	{
				this.table[tableNumber][0] = played;
				this.draw(player,cardPos);
	    	}	    
	    	else
	    	{
	    		this.discard(player,cardPos);
	    		this.livesLeft--;
			}
	  	}
		else
		{
	  		if(this.table[tableNumber][played.number - 2] && !this.table[tableNumber][played.number - 1])
	    	{
	    		this.table[tableNumber][played.number-1] = played;
	    		this.draw(player,cardPos);
	    	}
	    	else
	    	{
	    		this.livesLeft--;
	    		this.discard(player,cardPos);
	    	}
	  	}
	}
}

	//Rearranges the array in order to move cards around in one's hand 
	/*
	rearrange(player, cardPos, newPos, hands) {
		temp = new Card(hands[player][cardPos].color,hands[player][cardPos].number);

		hands[player][cardPos] = hands[player][newPos];

		hands[player][newPos] = temp;
	}*/