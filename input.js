function Keyboard(){
  this.w = {pressed: false, released: false, down: false};
  this.s = {pressed: false, released: false, down: false};
  this.a = {pressed: false, released: false, down: false};
  this.d = {pressed: false, released: false, down: false};

  this.GetKey = function(key){
    var result;
    switch(key){
      case 87: result = this.w; break;
      case 65: result = this.a; break;
      case 83: result = this.s; break;
      case 36: result = this.d; break;
    }
    return result;
  }

  this.Down = function(key){
    var key = this.GetKey(key);
    key.down ? key.pressed = false : key.pressed = true;
    key.released = false;
    key.down     = true;
  }

  this.Up = function(key){
    var key = this.GetKey(key);
    key.down ? key.released = true : key.released = false;
    key.pressed = false;
    key.down    = false;
  }
}

var k = new Keyboard;
