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
class Game{

	constructor(players){
		this.players = players; //array of users

		this.currentPlayer = 0;
		this.numInfoTokens = 0;
		this.livesLeft = 0;
		this.deck = [];
		this.hands = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];
		this.table = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)]; //red | blue | green | yellow | purple
		this.discard = [];

		var hitAreas = [];
	}

	initialize(){

	}

}


io.on('connection', function (socket) {
	var user = socket.handshake.username;
	var lobby = socket.handshake.lobby;
	//send info that this user has connected
	connectedUsers.push(new User(user, lobby, socket.id));
	console.log(user + " has connected to server");
	io.emit('chatMessage', user + ' has joined lobby: '+ lobby);

	//send list of currently connected users
	var listOfUsers = "";
	for (var i = 0; i < connectedUsers.length-1; i++) {
		listOfUsers += connectedUsers[i].name + ", ";
	}
	listOfUsers += connectedUsers[i].name;
	socket.emit('chatMessage', 'users connected:' + listOfUsers);

	//tell client what lobby they're in
	socket.emit('metadata', lobby);

	//chat message functionality
	socket.on('chatMessage', function(msg){
		console.log('Message: '+msg);
		io.emit('chatMessage', socket.handshake.username+": "+msg);
	})

	socket.join(lobby);
	socket.on('chatMessage2', function(msg){
		console.log('Message2: '+msg);
		io.to(lobby).emit('chatMessage2', socket.handshake.username+": "+msg);
	})

	//disconnect handling
	socket.on('disconnect', function(){
		var indexToRem = getUser(user);
		if (indexToRem != -1){
			connectedUsers.splice(indexToRem, 1);
		}
		console.log(user + " has disconnected");
		io.emit('chatMessage', user + ' has disconnected from lobby: '+ lobby);
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
		lobbies[gameLobby] = new Game(players);
		lobbies[gameLobby].initialize();

		//send initial game state for rendering
		io.to(gameLobby).emit('gameState', lobbies[gameLobby]);
		
		//let first player move
		var randomPlayer = Math.floor((Math.random() * players.length));
		lobbies[gameLobby].currentPlayer = randomPlayer;
		io.to(gameLobby).emit('chatMessage', "Game has begun. " + players[randomPlayer].name + "goes first!");
		socket.to(players[randomPlayer].socketid).emit('yourTurn', true);
	});

	socket.on('moveChoice', function(data)){
		var gameLobby = data[0];
		var choice = data[1]; //1 for discard, 2 for play, 3 for info
		var targetPlayer = data[2];
		var card = data[3];

		var choiceText = "";
		//update game
		if (choice == 1){
			lobbies[gameLobby].discard(targetPlayer, card);
			choiceText = "discarded a card!";
		} else if (choice == 2) {
			lobbies[gameLobby].playCard(targetPlayer, card);
			choiceText = "played a card!";
		} else if (choice == 3) {
			lobbies[gameLobby].giveInfo(targetPlayer, card);
			choiceText = "given information!";
		}

		//send initial game state for rendering
		io.to(gameLobby).emit('gameState', lobbies[gameLobby]);
		//let the players know what just happened
		var players = lobbies[gameLobby].players;
		var currentPlayer = lobbies[gameLobby].currentPlayer;
		io.to(gameLobby).emit('chatMessage', "Player "+lobbies[gameLobby].players[currentPlayer] + " has " + choiceText);
		//let next player move and update current player
		var nextPlayerIndex = (currentPlayer+1)%players.length;
		io.to(gameLobby).emit('chatMessage', players[nextPlayerIndex].name + "'s turn!");
		socket.to(players[nextPlayerIndex].socketid).emit('yourTurn', true);
		lobbies[gameLobby].currentPlayer = nextPlayerIndex;
	}

});

function getUser(user){
	for (var i = 0; i < connectedUsers.length; i++) {
		if (connectedUsers[i].name == user){
			return i;
		}
	}
	return -1;
}
