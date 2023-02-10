var PORT = process.env.PORT || 3015;
const server = require('express')();
const httpServer = require('http').createServer(server);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
let cors = require('cors');

let sessions = {};
let screen = 0;

io.on('connection', function(socket){
    screen++;
    sessions[socket.id] = {
        screen: screen
    }
    socket.emit('screenNumber', screen);

    socket.on('disconnect', function(){
        delete sessions[socket.id];
        // brute force - dirty!
        screen = 0;
    });

    socket.on('screen1start', function(){
        io.emit('startsequence');
    });

    socket.on('startscreen2sequence', function(){
        io.emit('startsequnce2');
    });

});

httpServer.listen(PORT, function () {
    console.log(`Server started on port ${PORT}!`);
});
