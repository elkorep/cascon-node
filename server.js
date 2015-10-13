/*
**IMPLEMENT THE SERVER
*/

/*The server requires the module express.io 
**In order to use appmetrics-dash, you will need to require appmetrics-dash and start it.
**Refer to https://www.npmjs.com/package/express.io for express.io usage
**Refer to https://www.npmjs.com/package/appmetrics-dash for appmetrics-dash usage
*/

var express = ; //express.io 
var app = ;//express http io
var appmetrics = ; //appmetrics-dash
var userList = {"lobby":[], "room1":[], "room2":[], "room3":[], "room4":[], "room5":[], "room6":[]}
var curUser = {"lobby": "", "room1": "", "room2": "", "room3": "", "room4": "", "room5": "", "room6": ""}

// Broadcast all draw clicks.
//app.io.route will send a specified event to this function, in this case 'drawClick' events
app.io.route('drawClick', function(req) {
    /*req.data is a json of the data that we want to send to the client.
    **The client has already sent us most of the data, but we want to broadbcast
    **back the client id of who sent it and the room it was emitted from. This info
    **is used to determine who and where the data is coming from.
    */

    //set the req.data.cid to the id found in the requests io.socket
  	req.data.cid = ; 
    //set the room to the same room that is found in req.data 
    var room = ;

    //broadcast to the room that we set above. 
    //for more info on how to broadcast to a specific room refer to https://www.npmjs.com/package/express.io
    
});

//app.io.on will run the callback function everytime the specified event is called, in this case 'connection' events.
app.io.on('connection', function(socket){
  console.log('connection recieved');

//this takes care of disconnect events
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

//When a client joins a room, the callback will be called.
app.io.route('joinRoom', function(socket) {
    //implement socket io's join function using socket.data as the parameter
    
    userList[socket.data].push(socket.io.socket.id)

    //emit "clientID" to the clients, with their id as the parameter

});

// Send client html.
//this callback function directs the client to the client.html file
app.get('/', function(req, res) {
    //implement a response sendfile with __dirname + '/client.html' as the file
});

//app.use makes the server aware of other directories and files.
app.use('/jscolor', express.static(__dirname + '/jscolor'));
app.use('/icons', express.static(__dirname + '/icons'));
app.use('/lib', express.static(__dirname + '/lib'));

//specify the port that the server is listening to.
app.listen(8080);

//Function to handle the turn by turn functionality
//no need to implement anything here.
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
