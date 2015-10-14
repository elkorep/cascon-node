var express = require('express.io');
var app = express().http().io();
var util=  require('util');
var appmetrics = require('appmetrics-dash').start();
var port = 8080;
var leak = process.argv[2];
var userList = {"lobby":[], "room1":[], "room2":[], "room3":[], "room4":[], "room5":[], "room6":[]}
var curUser = {"lobby": "", "room1": "", "room2": "", "room3": "", "room4": "", "room5": "", "room6": ""}

this.cache = new Object();
var self = this;

// Send client html.
app.get('/', function(req, res) {

    if(leak){
       processreq(req);
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

function processreq(req) {

    if(leak == 'heapsmall') {
        
      processHeapReq(req, 100, 500000);
    }

    else if(leak == 'heaplarge') {

      processHeapReq(req, 1024 * 1024 * 10, 5);
    }
    
    else if(leak == 'native') {

        var record = new processNativeReq(req);
        trace(record);
    }
    
    else {
        // do nothing.
        console.log('no leak option selected!');
    }

}

function processHeapReq(req, size, count) {

    for(var i=0;i<count; i++) {
    var buf = Array(size).join('0').split('');
    self.cache[process.hrtime()[1] + ' ' + i] = buf;
    }
    req.on('close', function() {
        // clear the cache
        self.cache = new Object();
    });
}


// Create a log record.
function processNativeReq(req) {

    this.data = wrap(req);
    this.len = util.inspect(req).length;
    console.log(this);
    // wrap the request data in a buffer.
    // as we don't know the size, use a huge
    // buffer, which anyways, gets garbage collected
    // when the request ends. :)
    function wrap(data) {

        var obj = new Object();
        for(var i=0;i<100;i++) {
            var buf = new Buffer(1024 * 1024);
            buf.fill('0');
            // place the request into the buffer.
            buf.write(util.inspect(data));
            obj[i] = buf;
        }
        var stamp = new Date();

        // store the buffer into the log record.
        this[stamp] = obj;
        // return the data.
        return this[stamp];
    }
}
// Print the log data.
function trace(d) {
    console.log(d.data);
}