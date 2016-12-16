var socket = io();

$(document).ready(onReady);

var width = 480;
var height = 320;

var wabbitTexture;
var pirateTexture;

// var bunnys = {};
var gravity = 0.5

var maxX = width;
var minX = 0;
var maxY = height;
var minY = 0;

var isAdding = false;
var count = 0;
var container;

var amount = 100;

function onReady(){
  renderer = PIXI.autoDetectRenderer(width, height, {backgroundColor:0x000001});
  stage = new PIXI.Stage(0x000000);

  document.body.appendChild(renderer.view);
  renderer.view.style.position = "absolute";

  requestAnimationFrame(update);

  wabbitTexture = new PIXI.Texture.fromImage("textures.png");

  // container = new PIXI.DisplayObjectContainer();
  container = new PIXI.ParticleContainer(1000000, [false, true, false, false, false]);
  stage.addChild(container);

  bunny1 = new PIXI.Texture(wabbitTexture.baseTexture, new PIXI.math.Rectangle(0,  0, 10, 10));
  bunny2 = new PIXI.Texture(wabbitTexture.baseTexture, new PIXI.math.Rectangle(0, 10, 10, 10));
  bunny3 = new PIXI.Texture(wabbitTexture.baseTexture, new PIXI.math.Rectangle(0, 20, 10, 10));
  bunny4 = new PIXI.Texture(wabbitTexture.baseTexture, new PIXI.math.Rectangle(0, 30, 10, 10));

  bunnyTextures = [bunny1, bunny2, bunny3, bunny4];
  document.addEventListener("keydown", KeyDown);
  document.addEventListener("keyup",   KeyUp);

  // $(renderer.view).mousedown(function(){
  //   MouseDown();
  // });

  // $(renderer.view).mouseup(function(){
  //   MouseUp();
  // });

  // This is for touch screens
  // document.addEventListener("touchstart", MouseDown, true);
  // document.addEventListener("touchend",   MouseUp,   true);
}

var up    = {"pressed": false, "released": false, "down": false};
var down  = {"pressed": false, "released": false, "down": false};
var left  = {"pressed": false, "released": false, "down": false};
var right = {"pressed": false, "released": false, "down": false};
var q     = {"pressed": false, "released": false, "down": false};

function KeyDown(key){ // console.log(key.keyCode);
  // W or Up Arrow
  if(key.keyCode === 87 || key.keyCode === 38){
    up.pressed  = true;
    up.released = false;
    up.down     = true;
  }

  // S or Down Arrow
  else if(key.keyCode === 83 || key.keyCode === 40){
    down.pressed  = true;
    down.released = false;
    down.down     = true;
  }

  // A or Left Arrow
  else if(key.keyCode === 65 || key.keyCode === 37){
    left.pressed  = true;
    left.released = false;
    left.down     = true;
  }

  // D or Right Arrow
  else if(key.keyCode === 68 || key.keyCode === 39){
    right.pressed  = true;
    right.released = false;
    right.down     = true;
  }

  // Q
  else if(key.keyCode === 81){
    q.pressed  = true;
    q.released = false;
    q.down     = true;
  }
}

function KeyUp(key){
  // W or Up Arrow
  if(key.keyCode === 87 || key.keyCode === 38){
    up.pressed  = false;
    up.released = true;
    up.down     = false;
  }

  // S or Down Arrow
  else if(key.keyCode === 83 || key.keyCode === 40){
    down.pressed  = false;
    down.released = true;
    down.down     = false;
  }

  // A or Left Arrow
  else if(key.keyCode === 65 || key.keyCode === 37){
    left.pressed  = false;
    left.released = true;
    left.down     = false;
  }

  // D or Right Arrow
  else if(key.keyCode === 68 || key.keyCode === 39){
    right.pressed  = false;
    right.released = true;
    right.down     = false;
  }

  // Q
  else if(key.keyCode === 81){
    q.pressed  = false;
    q.released = true;
    q.down     = false;
  }
}

function MouseDown(event){
}

function MouseUp(event){
}

var fpsCounter = 0;
var lastLoop = new Date;

console.log("==================================");
setInterval(function(){
  $("#obj").text(count);
  $("#fps").text(fpsCounter);
  console.log(fpsCounter);
  fpsCounter = 0;
  console.log("==================================");
}, 1000);

function update(){
  UpdatePhysics();

  renderer.render(stage);
  requestAnimationFrame(update);

  /////////
  // FPS //
  ++fpsCounter;
  var thisLoop = new Date;
  // var fps = 1000 / (thisLoop - lastLoop);
  // console.log(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
}

function UpdatePhysics(){
  if(up.down){
    socket.emit("move-up", null);
  }
  if(down.down){
    socket.emit("move-down", null);
  }
  if(left.down){
    socket.emit("move-left", null);
  }
  if(right.down){
    socket.emit("move-right", null);
  }

  // Add a ton of objects to tank our FPS
  //         0 objects = 60 FPS
  //   300,000 objects = 50 FPS
  //   400,000 objects = 38 FPS
  //   500,000 objects = 30 FPS
  //   600,000 objects = 25 FPS
  //   700,000 objects = 22 FPS
  //   800,000 objects = 20 FPS
  //   900,000 objects = 17 FPS
  // 1,000,000 objects = 15 FPS
  if(q.down){
    for(var i = 0; i < 100000; ++i){
      ++count;
      var bunny = new PIXI.Sprite(bunnyTextures[0]);
      bunny.id = null;
      bunny.x = 100;
      bunny.y = 100;
      bunny.anchor.x = 0.5;
      bunny.anchor.y = 0.5;
      container.addChild(bunny);
    }
  }
}

//////////////
// KEYBOARD //
//////////////

// Put code here

////////////////////////////
// MESSAGES TO THE SERVER //
////////////////////////////

socket.on("welcome", function(msg){
  for (var i in msg){
    ++count;
    var bunny = new PIXI.Sprite(bunnyTextures[msg[i].t]);
    bunny.id = msg[i].id;
    bunny.x = msg[i].pos.x;
    bunny.y = msg[i].pos.y;
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;
    // bunnys[bunny.id] = bunny;
    container.addChild(bunny);
  }
});

socket.on("new-player", function(msg){
  ++count;
  var bunny = new PIXI.Sprite(bunnyTextures[msg.t]);
  bunny.id = msg.id;
  bunny.x = msg.pos.x;
  bunny.y = msg.pos.y;
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;
  // bunnys[bunny.id] = bunny;
  container.addChild(bunny);
});

socket.on("player-leave", function(msg){
  for(var i = 0; i < container.children.length; ++i){
    if(container.children[i].id == msg){
      container.removeChild(container.children[i]);
      --count;
      break;
    }
  }

  // container.removeChild(bunnys[msg]);
  // delete bunnys[msg];
});

socket.on("update-positions", function(msg, pos){
  // Get something
  // console.log("=====================");
  for(var i = 0; i < container.children.length; ++i){
    if(container.children[i].id == msg)
    {
      // console.log(container.children[i]);
      container.children[i].x = pos.x;
      container.children[i].y = pos.y;
      break;
    }
  }
});

///////////
// TRASH //
///////////

// $(window).resize(resize)
// window.onorientationchange = resize;

// function resize(){
//   var width = $(window).width();
//   var height = $(window).height();

//   if(width > 800)width  = 800;
//   if(height > 600)height = 600;

//   maxX = width;
//   minX = 0;
//   maxY = height;
//   minY = 0;

//   var w = $(window).width() / 2 - width/2;
//   var h = $(window).height() / 2 - height/2;

//   renderer.view.style.left = $(window).width() / 2 - width/2 + "px"
//   renderer.view.style.top = $(window).height() / 2 - height/2 + "px"

//   renderer.resize(width, height);
// }
