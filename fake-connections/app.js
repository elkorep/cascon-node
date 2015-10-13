var connections = process.argv[2];
var ioConnections = [];
// var port = process.argv[3];
// var connections = process.argv[4];

for (var i = 0; i < connections; i++) {
  createConnection();
}

//Draw 100 times each connection
for(var j = 0; j < 100; j++){
  ioConnections.forEach(drawEmit);
}

function createConnection() {
  var socket = require('socket.io-client');
  io = socket.connect('http://localhost:8080', { 'force new connection': true });
  console.log("connection created");
  io.emit('joinRoom', 'lobby');
  ioConnections.push(io);
}

function drawEmit(io, index, ar){
    // console.log('connection ', index, ' drawing');

    var startx = Math.floor(Math.random() * 800) + 100;
    var starty = Math.floor(Math.random() * 600) + 100;
    var range = 300;

    data = {
      x: startx,
      y: starty,
      type: "dragstart"
    };

    io.emit('drawClick', data);

    for (var i = 0; i < range; i++){
      data = {
        x: startx + i,
        y: starty + i,
        type: "drag"
      };

      io.emit('drawClick', data);
    }

    data = {
      x: range + startx,
      y: range + starty,
      type: "dragend"
    };

    io.emit('drawClick', data);
}
