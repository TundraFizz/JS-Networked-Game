var socket = io();

$(document).ready(onReady);

// $(window).resize(resize)
// window.onorientationchange = resize;

var width = 480;
var height = 320;

var wabbitTexture;
var pirateTexture;

var bunnys = {};
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

  // $(document).keydown(function(event){
  //   console.log(event.which);
  //   // UP: 87 & 38
  //   // RIGHT: 36 & 39
  // });
  // THIS IS NOT A GOOD WAY OF DOING THINGS, FIX LATER
  // THIS IS NOT A GOOD WAY OF DOING THINGS, FIX LATER
  // THIS IS NOT A GOOD WAY OF DOING THINGS, FIX LATER
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  var timeout, clicker = $("canvas");

  clicker.mousedown(function(){
    timeout = setInterval(function(){
      MouseDown();
    }, 100);
    return false;
  });

  $(document).mouseup(function(){
      clearInterval(timeout);
      return false;
  });

  renderer.render(stage);
  requestAnimationFrame(update);
}
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// THIS IS NOT A GOOD WAY OF DOING THINGS, FIX LATER
// THIS IS NOT A GOOD WAY OF DOING THINGS, FIX LATER
// THIS IS NOT A GOOD WAY OF DOING THINGS, FIX LATER

//////////////
// KEYBOARD //
//////////////
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

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
    bunnys[bunny.id] = bunny;
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
  bunnys[bunny.id] = bunny;
  container.addChild(bunny);
});

socket.on("player-leave", function(msg){
  container.removeChild(bunnys[msg]);
});

socket.on("update-positions", function(msg, pos){
  bunnys[msg].x = pos.x;
  bunnys[msg].y = pos.y;
});

///////////
// TRASH //
///////////

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
