//require the hhtp module of node
var express = require('express')
var app = express();
var http = require("http");
var fs=require('fs');
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//returns server object
var server = http.createServer(app)

var io = require('socket.io')(server);

server.listen(process.env.PORT || 5000); //listen on port

var connectedUsers = [];

//see http://expressjs.com/en/guide/routing.html for details
//for security, make all paths route to index
app.get('/*', function (request, response) {
	var file = "index.html";
	var direction = request.params[0];
	//console.log(direction);
	if(!direction){
		response.sendFile('/'+file , { root:__dirname });	
	} else {
		response.sendFile('/'+direction , { root:__dirname });
	}
});

//on pressing the submit button in index
app.post('*', function (request, response) {
	var users = [];

	fs.readFile('users.json', 'utf8', function(err, data){ //authentication based on name (name is password)
		var parsedUsers = JSON.parse(data);
		var i = 0;
		while(parsedUsers.users[i]){
			users.push(parsedUsers.users[i].name.toLowerCase());
			i++;
		}
		var user = request.body.username.toLowerCase();
		if(users.indexOf(user) != -1 && getUser(user)) {
			//enter the lobby request.body.lobbyName, or create it if it doesnt exist
			io.use(function(socket, next) {
			  //var handshake = socket.request;
			  socket.handshake.username = request.body.username;
			  socket.handshake.lobby = request.body.lobbyName;
			  next();
			});

			response.sendFile('/lobby.html' , { root:__dirname });
		} else {
			response.send("unregistered or duplciate user: " + user);
		}
	});


});

class User{
	constructor(name, lobby, socketid){
		this.name = name;
		this.lobby = lobby;
		this.socketid = socketid;
	}
}

var lobbies = {}; //dicitonary from lobby name to game: lobbies[lobby] = game

//all the information needed for a game, move do a different file soon
//this is for testing purposes only
class Game{

	constructor(players){
		this.players = players; //array of users

		this.currentPlayer = 0;
		this.testState = "";
	}

	initialize(){
		this.testState ="initialization done \n";
	}

	discard(player, card){
		this.testState+="discarded card " +  card + " from player " + player + " \n";

	}

	playCard(player, card){
		this.testState+="played card " +  card + " from player " + player + " \n";

	}

	giveInfo(playCard, card){
		this.testState+="gave info about " +  card + " from player " + playCard + " \n";

	}

	isGameOver(){
		return false;

	}

	getScore(){
		return 17;

	}
}

//todo: fix race conition of multiple same user (line 50)
io.on('connection', function (socket) {
	var user = socket.handshake.username;
	var lobby = socket.handshake.lobby;
	//send info that this user has connected
	connectedUsers.push(new User(user, lobby, socket.id));
	console.log(user + " has connected to server");
	io.emit('serverMessage', user + ' has joined lobby: '+ lobby);

	//send list of currently connected users
	var listOfUsers = "";
	for (var i = 0; i < connectedUsers.length-1; i++) {
		listOfUsers += connectedUsers[i].name + ", ";
	}
	listOfUsers += connectedUsers[i].name;
	socket.emit('serverMessage', 'users connected:' + listOfUsers);

	//tell client what lobby they're in
	socket.emit('metadata', lobby);

	//chat message functionality
	socket.on('serverMessage', function(msg){
		console.log('Message: '+msg);
		io.emit('serverMessage', socket.handshake.username+": "+msg);
	})

	socket.join(lobby);
	io.to(lobby).emit('lobbyMessage', user + ' has joined this lobby');
	socket.on('lobbyMessage', function(msg){
		console.log('Message2: '+msg);
		io.to(lobby).emit('lobbyMessage', socket.handshake.username+": "+msg);
	})

	var usersInLobby = "";
	for (var i = 0; i < connectedUsers.length-1; i++) {
		if(connectedUsers[i].lobby == lobby){
			usersInLobby += connectedUsers[i].name + ", ";
		}
	}
	usersInLobby += connectedUsers[i].name;
	socket.emit('lobbyMessage', 'users connected:' + usersInLobby);

	//disconnect handling
	socket.on('disconnect', function(){
		var indexToRem = getUser(user);
		if (indexToRem != -1){
			connectedUsers.splice(indexToRem, 1);
		}
		console.log(user + " has disconnected");
		io.emit('serverMessage', user + ' has disconnected from lobby: '+ lobby);
	});

	//game functionality
	socket.on('startGame', function(gameLobby){
		//initialize game
		var players = []; //players in the lobby
		for (var i = 0; i < connectedUsers.length; i++) {
			if (connectedUsers[i].lobby == gameLobby){
				players.push(connectedUsers[i]);
			}
		}
		if(players.length > 1){
			lobbies[gameLobby] = new Game(players);
			lobbies[gameLobby].initialize();

			//send initial game state for rendering
			io.to(gameLobby).emit('gameState', lobbies[gameLobby]);
			
			//let first player move, should do in game class's initialize
			// var randomPlayer = Math.floor((Math.random() * players.length));
			// lobbies[gameLobby].currentPlayer = randomPlayer;
			var startingPlayer = lobbies[gameLobby].currentPlayer;
			io.to(gameLobby).emit('lobbyMessage', "Game has begun. " + players[startingPlayer].name + " goes first!");
			socket.to(players[startingPlayer].socketid).emit('yourTurn', true);
		} else {
			io.to(gameLobby).emit('error', "not enough players");

		}
	});

	socket.on('moveChoice', function(data){
		var gameLobby = data[0];
		var choice = data[1]; //1 for play, 2 for discard, 3 for info
		var targetPlayer = data[2];
		var card = data[3];

		var currentPlayer = lobbies[gameLobby].currentPlayer;
		var players = lobbies[gameLobby].players;
		if(socket.id == players[currentPlayer].socketid) {
			var choiceText = "";
			//update game
			if (choice == 1){
				lobbies[gameLobby].playCard(targetPlayer, card);
				choiceText = "played a card!";
			} else if (choice == 2) {
				lobbies[gameLobby].discard(targetPlayer, card);
				choiceText = "discarded a card!";
			} else if (choice == 3) {
				lobbies[gameLobby].giveInfo(targetPlayer, card);
				choiceText = "given information!";
			}

			//send initial game state for rendering
			io.to(gameLobby).emit('gameState', lobbies[gameLobby]);
			//let the players know what just happened
			io.to(gameLobby).emit('lobbyMessage', "Player "+players[currentPlayer].name + " has " + choiceText);
			if(lobbies[gameLobby].isGameOver()){
				//let the players know the score and game over
				io.to(gameLobby).emit('lobbyMessage', "Game Over!");
				io.to(gameLobby).emit('lobbyMessage', "The score was " + lobbies[gameLobby].getScore());
				io.to(gameLobby).emit('gameOver', true);
			} else {
				//let next player move and update current player
				//todo: move logic to game so i dont have to set curent players here
				var nextPlayerIndex = (currentPlayer+1)%players.length;
				lobbies[gameLobby].currentPlayer = nextPlayerIndex;
				io.to(gameLobby).emit('lobbyMessage', players[nextPlayerIndex].name + "'s turn!");
				socket.to(players[nextPlayerIndex].socketid).emit('yourTurn', true);
			}
		}
	});

});

function getUser(user){
	for (var i = 0; i < connectedUsers.length; i++) {
		if (connectedUsers[i].name == user){
			return i;
		}
	}
	return -1;
}
