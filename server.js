var express = require("express");
var app     = express();

app.use(express.static("./static"));
app.set("views", "./views");

app.get("/", function(req, res){
  res.render("index.ejs");
});

const server = app.listen(9001);
const io     = require("socket.io")(server, {"pingInterval": 5000, "pingTimeout": 12000});

var players   = {};
var pCount    = 0;

io.on("connection", function(socket){
  process.stdout.write("Incoming connection... ");

  if(pCount == 2){
    console.log("Refused! Too many players.");
    io.to(socket.id).emit("custom", "Too many people!"); // Send to a specific person
    socket.disconnect(socket.id);
    return;
  }

  var player   = {};
  player.num   = ++pCount;
  player.id    = socket.id;
  player.pos = {};
  player.pos.x = Rand(20, 460);
  player.pos.y = Rand(20, 300);
  player.t     = Rand( 0,   3);
  // player.x     = player.pos.x;
  // player.y     = player.pos.y;
  players[socket.id] = player;
  // console.log(player);

  // console.log("Accepted! Player", pCount, "with ID:", socket.id);

  // Send personal message to new person
  io.to(socket.id).emit("welcome", players);

  // Send another message to everyone else
  socket.broadcast.emit("new-player", player);

  socket.on("disconnect", function(){
    --pCount;
    var player = players[socket.id];
    // console.log("Player", player.num, "with ID:", player.id, "disconnected... remaining players:", pCount);
    delete players[socket.id];
    socket.broadcast.emit("player-leave", socket.id);
  });

  //////////////////////////////////////////////////////////////////

  socket.on("move-up", function(msg){
    players[socket.id].pos.y -= 5;
    UpdatePosition(socket.id, players[socket.id].pos);
  });

  socket.on("move-down", function(msg){
    players[socket.id].pos.y += 5;
    UpdatePosition(socket.id, players[socket.id].pos);
  });

  socket.on("move-left", function(msg){
    players[socket.id].pos.x -= 5;
    UpdatePosition(socket.id, players[socket.id].pos);
  });

  socket.on("move-right", function(msg){
    players[socket.id].pos.x += 5;
    UpdatePosition(socket.id, players[socket.id].pos);
  });
});

var stopServer = false;
var loop = setInterval(function(){
  if(stopServer) clearInterval(loop);
}, 1);

function Rand(low, high){
  return Math.floor(Math.random() * (high-low + 1) + low);
}

//////////////////////
// Helper Functions //
//////////////////////
function UpdatePosition(id, pos){io.emit("update-positions", id, pos);}
