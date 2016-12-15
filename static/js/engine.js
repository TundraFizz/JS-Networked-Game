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

  container = new PIXI.DisplayObjectContainer();
  container = new PIXI.ParticleContainer(200000, [false, true, false, false, false]);
  stage.addChild(container);

  bunny1 = new PIXI.Texture(wabbitTexture.baseTexture, new PIXI.math.Rectangle(0,  0, 10, 10));
  bunny2 = new PIXI.Texture(wabbitTexture.baseTexture, new PIXI.math.Rectangle(0, 10, 10, 10));
  bunny3 = new PIXI.Texture(wabbitTexture.baseTexture, new PIXI.math.Rectangle(0, 20, 10, 10));
  bunny4 = new PIXI.Texture(wabbitTexture.baseTexture, new PIXI.math.Rectangle(0, 30, 10, 10));

  bunnyTextures = [bunny1, bunny2, bunny3, bunny4];
  document.addEventListener("keydown", KeyDown);

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

function KeyDown(key){
  // console.log(key.keyCode);

  // W or Up Arrow
  if(key.keyCode === 87 || key.keyCode === 38){
    socket.emit("move-up", null);
  }

  // S or Down Arrow
  else if(key.keyCode === 83 || key.keyCode === 40){
    socket.emit("move-down", null);
  }

  // A or Left Arrow
  else if(key.keyCode === 65 || key.keyCode === 37){
    socket.emit("move-left", null);
  }

  // D or Right Arrow
  else if(key.keyCode === 68 || key.keyCode === 39){
    socket.emit("move-right", null);
  }
}

function MouseDown(event){
}

function MouseUp(event){
}

function update(){
  renderer.render(stage);
  requestAnimationFrame(update);
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
    if(container.children[i].id == msg)
    {
      container.removeChild(container.children[i]);
      break;
    }
  }

  // container.removeChild(bunnys[msg]);
  // delete bunnys[msg];
});

socket.on("update-positions", function(msg, pos){
  // Get something
  console.log("=====================");
  for(var i = 0; i < container.children.length; ++i){
    if(container.children[i].id == msg)
    {
      console.log(container.children[i]);
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
