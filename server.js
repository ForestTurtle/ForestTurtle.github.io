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
	constructor(name, lobby){
		this.name = name;
		this.lobby = lobby;
	}
}

io.on('connection', function (socket) {
	var user = socket.handshake.username;
	var lobby = socket.handshake.lobby;
	//send info that this user has connected
	connectedUsers.push(new User(user, lobby));
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
});

function getUser(user){
	for (var i = 0; i < connectedUsers.length; i++) {
		if (connectedUsers[i].name == user){
			return i;
		}
	}
	return -1;
}
// var lobby1 = io.of('/lobby1').on('connection', function (socket) {
// 	console.log("user has connected to lobby1");

// 	socket.on('disconnect', function(){
// 		console.log("user has disconnected from lobby1");
// 	});

// 	socket.on('chatMessage', function(msg){
// 		console.log('Message: '+msg);
// 		io.emit('chatMessage', msg);
// 	})
// });




