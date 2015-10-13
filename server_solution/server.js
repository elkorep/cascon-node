var express = require('express.io');
var app = express().http().io();
var appmetrics = require('appmetrics-dash').start();
var util =  require('util');
var port = 8080;
var leak = process.argv[2];
var userList = {"lobby":[], "room1":[], "room2":[], "room3":[], "room4":[], "room5":[], "room6":[]}
var curUser = {"lobby": "", "room1": "", "room2": "", "room3": "", "room4": "", "room5": "", "room6": ""}

// Send client html.
app.get('/', function(req, res) {

    //If you are debugging a leak then pass leak as an argument when running the server
    if(leak == 'leak')
    {
        // Create a record for request object, and trace it.
        var record = new LogRecord(req);
        // log the record.
        trace(record);
    }
    res.sendfile(__dirname + '/client.html');
});

// Broadcast all draw clicks.
app.io.route('drawClick', function(req) {
  	req.data.cid = req.io.socket.id;
    var room = req.data.room;
    req.io.room(room).broadcast('draw', req.data);
});

app.io.on('connection', function(socket){
  console.log('connection recieved');
  socket.on('disconnect', function() {
    // remove the disconnected socket from the room list
    for (var room in socket['manager']['rooms']){
      if (room === ''){
        var index = userList['lobby'].indexOf(socket.id);
        if (index > -1) {
            userList['lobby'].splice(index, 1);
        }
      }else{
        roomStr = room.slice(1)
        var index = userList[roomStr].indexOf(socket.id);
        if (index > -1) {
            userList[roomStr].splice(index, 1);
        }
      }
    }
    // console.log('Someone disconnected: ' + socket.id);
    // console.log(socket['manager']['rooms'])
  });
});

app.io.route('joinRoom', function(socket) {
    socket.io.join(socket.data)
    userList[socket.data].push(socket.io.socket.id)
    socket.io.socket.emit("clientID", socket.io.socket.id)
});

app.use('/jscolor', express.static(__dirname + '/jscolor'));
app.use('/icons', express.static(__dirname + '/icons'));
app.use('/lib', express.static(__dirname + '/lib'));

app.listen(port);

for(var room in userList){
    if(room != "lobby"){
        (function theLoop(i, r) {
            setTimeout(function () {
                curUser[r] = userList[r][i];
                // console.log(userList[r]);
                app.io.room(r).broadcast('currentUser', curUser[r])
                i++
                if (i < userList[r].length) {          // If i < length, keep going
                    theLoop(i, r);       // Call the loop again, and pass it the current value of i
                } else {
                    i = 0;
                    theLoop(i, r);
                }
            }, 10000);
        })(0, room);
    }
};

// The following code is for leak debugging
// Create a log record.
function LogRecord(req) {

    this.data = wrap(req);
    this.len = util.inspect(req).length;

    // wrap the request data in a buffer.
    // as we don't know the size, use a huge
    // buffer, which anyways, gets garbage collected
    // when the request ends. :)
    function wrap(data) {
        var buf = new Buffer(1024 * 1024 * 100);
        buf.fill('0');

        // place the request into the buffer.
        buf.write(util.inspect(data));
        var stamp = new Date();

        // store the buffer into the log record.
        this[stamp] = buf;
        // return the data.
        return this[stamp];
    }
}

// Print the log data.
function trace(d) {
    console.log(d.data.slice(0, d.len).toString());
}
