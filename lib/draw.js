var drawTools = {
    PENCIL: "pencil",
    PAINTBRUSH: "paintbrush",
    ERASER: "eraser"
};
var clr;
var brs = "1";
var drawType = drawTools.PENCIL;
var clients = {
    ID: {
        x:0,
        y:0
    }
};
var clientID = "ID";
var drawFlag = false;

pencil();

// Draw Function
App.draw = function(data) {
    if (data.type == "dragstart") {
        //App.ctx.beginPath()
        var thisClient = {};
        thisClient.x = data.x
        thisClient.y = data.y
        thisClient.color = data.color
        thisClient.size = data.size;
        clients[data.cid] = thisClient;
    } else if (data.type == "drag") {
        App.ctx.beginPath()
        App.ctx.moveTo(clients[data.cid].x,clients[data.cid].y)
        App.ctx.lineTo(data.x,data.y)
        App.ctx.strokeStyle = clients[data.cid].color
        App.ctx.lineWidth = clients[data.cid].size
        App.ctx.stroke()
        clients[data.cid].x = data.x
        clients[data.cid].y = data.y
    } else {
        App.ctx.stroke()
        App.ctx.closePath()
    }
}

function colorChange()
{
    if(drawType != drawTools.ERASER){
        clr = "#" + document.getElementById('colorIn').value;
    }
}

function pencil()
{
    clr = "#" + document.getElementById('colorIn').value;
    if(brs > 5)
    {
        brs = brs/10;
    }
    
    drawType = drawTools.PENCIL;

    //change cursor to paintbrush
    document.getElementById("canvas").style.cursor = "url('icons/cpen.png') 0 100, auto";
}

function paintBrush()
{
    clr = "#" + document.getElementById('colorIn').value;
    brs = document.getElementById('resizeIn').value;
    drawType = drawTools.PAINTBRUSH;

    //change cursor to paintbrush
    document.getElementById("canvas").style.cursor = "url('icons/cbrush2.png') 4 100, auto";
}

function eraser()
{
    clr = "#FFFFFF";
    brs = document.getElementById('resizeIn').value;
    drawType = drawTools.ERASER;

    //change cursor to eraser
    document.getElementById("canvas").style.cursor = "url('icons/crubber2.png') 6 100, auto";
}

function resize()
{
    brs = document.getElementById('resizeIn').value;
    if (drawType == drawTools.PENCIL)
    {
        brs = brs/10;
    }
}

App.socket.on('clientID', function(data){
    clientID = data;
    document.getElementById("room").innerHTML = selectedRoom.toUpperCase();
    if(selectedRoom != "lobby"){
        document.getElementById("turn").innerHTML = "Waiting for your turn...";
    }
    else {
        document.getElementById("turn").innerHTML = "NODE JS CANVAS DEMO";
    }
    
})

// Draw from other sockets
App.socket.on('draw', App.draw)

App.socket.on('currentUser', function(data){
    if (clientID == data) {
        drawFlag = true;
        document.getElementById("turn").innerHTML = "YOUR TURN!";
    }
    else
    {
        drawFlag = false;
        document.getElementById("turn").innerHTML = "Waiting for your turn...";
    }
})

// Bind click and drag events to drawing and sockets.
$(function() {
    App.ctx = $('canvas')[0].getContext("2d")
    $('canvas').live('drag dragstart dragend', function(e) {
        offset = $(this).offset()
        data = {
            x: (e.clientX - offset.left),
            y: (e.clientY - offset.top),
            type: e.handleObj.type,
            color: clr,
            size: brs,
            tool: drawType,
            cid: clientID,
            room: selectedRoom
        }
        if(data.room == "lobby" || drawFlag){
            App.draw(data) // Draw yourself.
            App.socket.emit('drawClick', data) // Broadcast draw.
        }
    })
})

