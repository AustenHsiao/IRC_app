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
    socket.on('send_msg', (messageObject) => {
        io.sockets.emit('send_msg_response', messageObject);
    });

    socket.on('set_username', (data) => {
        var newUser = data.user.toLowerCase();
        socket.username = newUser;
        if(users[newUser] !== undefined){
            socket.emit('set_username_response', 0);
        }else{
            users[newUser] = {"name":data.user};
            socket.emit('set_username_response', data.user);
            console.log(users);
        } 
    });

    socket.on('delete_room', data => {
        var roomname = data.room.toLowerCase();
        console.log(rooms);
        delete rooms[roomname];
        console.log(rooms);
        io.sockets.emit('delete_room_response', {"deleter": data.name, "room": roomname});
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

            io.sockets.emit('userlist_update', JSON.stringify(users));
        }
        // in any case, send the rooms list back
        io.sockets.emit('refresh_room_list', rooms);
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
            io.sockets.emit('userlist_update', JSON.stringify(users));
        }
        io.sockets.emit('refresh_room_list', rooms);
    });

    socket.on('disconnect', () => {
        console.log(`${socket.username} left`);
        delete users[socket.username.toLowerCase()];
        console.log(users);
    });
});

server.listen(port, () => {
    console.log("Listening on port 8080");
});
