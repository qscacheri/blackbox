var container = document.getElementById("canvas-container")
var resizingLevel;
var consoleLevel;
var visitors = {};
var ble;
var font;
var save = true;
var welcomeImage;
var blackBoxImage;


//function for setting color of a png image
function colorReplace(theColor)
{
    let pixelsCopy = backImage.pixels.slice(0);
    for (var i = 0; i < backImage.pixels.length; i += 4) {
        // if this rg&b pixel is not black (aka not the arrow)
        if (pixelsCopy[i] != 0 || pixelsCopy[i + 1] != 0 || pixelsCopy[i + 2] != 0) {
            //set the color to the color of the current level
            pixelsCopy[i] = theColor.levels[0];
            pixelsCopy[i + 1] = theColor.levels[1];
            pixelsCopy[i + 2] = theColor.levels[2];
        }
    }
    return pixelsCopy;
}

function preload() {
    backImage = loadImage("back_arrow.png")
	font = loadFont("BigShouldersText-Light.ttf");
	welcomeImage = loadImage("welcome.png");
	blackBoxImage = loadImage("cube.png");
}

function setup() {
    var canvas = createCanvas(container.offsetWidth, window.innerHeight);
    canvas.parent("canvas-container")
    game = new Game(Cookies.get("game-data"));
    backImage.loadPixels();
    coloredImages.push(colorReplace(color("#4AFFD3")));
    coloredImages.push(colorReplace(color("#79DA42")));
    coloredImages.push(colorReplace(color("#FFEF00")));
    coloredImages.push(colorReplace(color("#FFB02F")));
    coloredImages.push(colorReplace(color("#FF2F2F")));
	document.getElementById("reset-button").onclick = function()
	{
		if (game.state == Game.states.lastLevel)
		{
			game.state = Game.states.gameComplete;
		}
		else {
			save = false;
			document.location.reload();
		}
	}

}

function draw() {
    background(0);
	textSize(13);
	fill(255)
	noStroke();
    game.draw();
}

function keyPressed() {

    if (keyCode == BACKSPACE) {
        game.levels[1].textEntry.handleKey(key, true);
        game.levels[3].textEntry.handleKey(key, true);
    }
	else if (keyCode == ENTER) {
        game.levels[1].checkSecretCode();
        game.levels[3].checkSecretCode();

    }
 	else if (keyCode == SHIFT || keyCode == 20)
        return
    else {
        game.levels[1].textEntry.handleKey(key, false);
        game.levels[3].textEntry.handleKey(key, false);
    }
}

function windowResized() {
    resizeCanvas(container.offsetWidth, container.offsetHeight);
	game.resized();
    if (game.currentLevel == 0) {
        game.setState(Game.states.levelComplete);
        game.levels[game.currentLevel].isComplete = true;
    }
}

function mousePressed() {
    game.detectClick();
    getAudioContext().resume();

}

window.onbeforeunload = function()
{
	if (save)
		game.saveGame(game.levels[4].hasVisited);
	else
	{
		var data = {
		completeLevels: [false, false, false, false, false],
		hasVisitedLevel: false //just for closeLevel
		};
		Cookies.set("game-data", JSON.stringify(data));
	}
}
