const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 8080;


var users = {}; //store usernames
var rooms = {}; //store roomnames

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('somebody connected');

    socket.on('sendMsg', (messageObject) => {
        io.sockets.emit('chat', messageObject);
    });

    socket.on('set_username', (data) => {
        var newUser = data.user.toLowerCase();
        if(users[newUser] !== undefined){
            socket.emit('set_username_response', 0);
        }else{
            users[newUser] = {"name":data.user};
            socket.emit('set_username_response', data.user);
            console.log(users);
        } 
    });
    
    socket.on("refreshList", data => {
        socket.emit('refresh_room_list', rooms);
    });

    socket.on('create_chatroom', (data) => {
        var newRoom = data.room.toLowerCase();
        var username = data.name.toLowerCase();
        if(rooms[newRoom] !== undefined){
            socket.emit('create_chatroom_response', 0);
        }else{
            users[username] = data; // update userdata to include a room
            rooms[newRoom] = 1; 
            socket.emit('create_chatroom_response', data.room);
            console.log(users);
        }
        // in any case, send the rooms list back
        socket.emit('refresh_room_list', rooms);
    });

    socket.on('join_chatroom', (data) => {
        var joinRoom = data.room.toLowerCase();
        var username = data.name.toLowerCase();

        if(rooms[joinRoom] === undefined){
            socket.emit('join_chatroom_response', 0);
        }else{
            users[username] = data;
            socket.emit('join_chatroom_response', data.room);
            console.log(users);
        }
        socket.emit('refresh_room_list', rooms);
    });
});



server.listen(port, () => {
    console.log("Listening on port 8080");
});
