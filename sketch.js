var container = document.getElementById("canvas-container")
var game;
var resizingLevel;
var consoleLevel;
var visitors = {};
var ble;

function colorReplace(theColor) {
	let pixelsCopy = backImage.pixels.slice(0);
	for (var i = 0; i < backImage.pixels.length; i += 4) {
		// console.log(this.img.pixels[i]);
		// if this rg&b pixel is not black (aka not the arrow)
		if (pixelsCopy[i] != 0 || pixelsCopy[i + 1] != 0 || pixelsCopy[i + 2] != 0) {
			//set the color to the color of the current level
			pixelsCopy[i] = theColor.levels[0];
			pixelsCopy[i + 1] = theColor.levels[1];
			pixelsCopy[i + 2] = theColor.levels[2];
		}
	}
	console.log(pixelsCopy);
	return pixelsCopy;
}

function preload()
{
	backImage = loadImage("back_arrow.png")

}

function setup() {
	  var canvas = createCanvas(container.offsetWidth, window.innerHeight);
	  canvas.parent("canvas-container")
	  console.log(container.offsetWidth);
      game = new Game();
	  backImage.loadPixels();
	  coloredImages.push(colorReplace(color("#79DA42")));
	  coloredImages.push(colorReplace(color("#CEDA42")));
	  coloredImages.push(colorReplace(color("#FFEF00")));

	  ble = new p5ble();
}

function draw() {
      background(0);
      game.draw();

      //resizingLevel.draw();
      //consoleLevel.draw();
}

function keyPressed() {

      if (keyCode == BACKSPACE)
            game.levels[1].textEntry.handleKey(key, true);
      else if (keyCode == ENTER)
            game.levels[1].checkCode();
      else if (keyCode == SHIFT || keyCode == 20)
            return
      else
            game.levels[1].textEntry.handleKey(key, false);
      // if (key == 'a' || key == 'A')
      //       setCookie("visited", true, 1);
      // if (key == 'f' || key == 'F')
      //       console.log(getCookie("visited"));
}

function windowResized() {
	resizeCanvas(container.offsetWidth, container.offsetHeight);
	if (game.currentLevel == 0) {
		game.state = Game.states.levelComplete;
		game.levels[game.currentLevel].isCompleted = true;
	}
}

function mousePressed()
{
	game.detectClick();
}

function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	console.log("getting");
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                  c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
            }
      }
      return "";
}
