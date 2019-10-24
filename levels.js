//SUPER class for all the level classes
class Level {
    constructor(x, y, color, game) {
        this.icon = {
            x: x,
            y: y
        };
        this.color = color;
        //give the levels a reference to the Game so when user completes a level the level can change the gamestate
        this.game = game;
    }
};

//resizing the browser window level
class ResizingLevel extends Level {
    constructor(xpos, ypos, color) {
        super(xpos, ypos, color)
        this.won = false;
        this.width = 40;
        this.height = 0;
        this.isCompleted = false;
    }

    draw() {
        //draw the window image clue
        fill(255);
        rectMode(CENTER, CENTER);
        rect(width / 2, height / 2, this.width, this.height);

        //make it "resize" itself
        this.width += 1;
        this.height += 1;
        if (this.width > 300)
            this.width = 40;
        if (this.height > 200)
            this.height = 0;

        //draw the 3 broswer buttons (close, minimize, expand)
        ellipseMode(CORNER);
        noStroke();
        fill(255, 0, 0);
        ellipse(2 + width / 2 - this.width / 2, 2 + height / 2 - this.height / 2, 10, 10);

        fill(255, 255, 0);
        ellipse(14 + width / 2 - this.width / 2, 2 + height / 2 - this.height / 2, 10, 10);

        fill(0, 255, 0);
        ellipse(28 + width / 2 - this.width / 2, 2 + height / 2 - this.height / 2, 10, 10);
        ellipseMode(CENTER);

    }
}

//open javascript console level
class ConsoleLevel extends Level {
    constructor(x, y, color) {
        super(x, y, color);
        this.consoleWidth = width*0.1;
        this.consoleX = -this.consoleWidth;
        this.shouldSlideOut = true;
        this.text = [];
        this.textEntry = new TextEntry(width / 2, height / 2, width / 4, height / 16);
        this.isCompleted = false;
    }

    checkCode() {
        if (parseInt(this.textEntry.text) == 618) {
            console.log("You got it");
        }
    }

    draw() {
        this.textEntry.draw();
        console.log("The code is ", 618);
        if (this.shouldSlideOut)
            this.slideOutConsole();
        else
            this.drawText();
    }

    slideOutConsole() {
        fill(255);
        rectMode(CORNER);
        rect(this.consoleX, 0, this.consoleWidth, height);
        this.consoleX++;
        this.counter = 0;

        if (this.consoleX >= 0) {
            this.shouldSlideOut = false;
        }

        noFill();
        stroke(255);
        // stroke("#997FFF");
        rectMode(CENTER, CENTER);
        rect(width / 2, height / 2, width / 4, height / 16);
    }

    drawText() {
        this.consoleWidth = width*0.1;
        textAlign(CORNER);
        textSize(20);
        noFill();
        stroke(255);
        rectMode(CENTER, CENTER);
        rect(width / 2, height / 2, width / 4, height / 16);

        if (this.counter >= 2) {
            this.text.push({
                text: random(1000),
                y: 0
            });
        }

        fill(255);
        rectMode(CORNER);
        rect(this.consoleX, 0, this.consoleWidth, height);
        fill("#997FFF");
        for (var i = 0; i < this.text.length; i++) {
            this.text[i].y += 10;
            if (this.text[i].y > height) {
                this.text.splice(i, 1);
                i--;
            } else {
                text(this.text[i].text, 10, this.text[i].y, this.consoleWidth, 10);
            }
        }
        this.counter++;
        this.counter %= 3;
    }
}

//NOT A LEVEL class
//used to handle entering text for the js console level
class TextEntry {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = "";
        this.maxLength = 3;
    }

    handleKey(theKey, isBackspace) {
        if (isBackspace) {
            this.text = this.text.substring(0, this.text.length - 1);
            return;
        }

        if (theKey.length > 1)
            theKey = theKey[0];
        if (this.text.length + 1 <= 3)
            this.text += theKey;
        else return;
    }

    draw() {
        var size = height * .1;
        textSize(size);
        textAlign(CENTER, CENTER);
        textSize(size / 2);
        noStroke();
        fill("#997FFF");
        text(this.text, this.x, this.y);
    }
}

// //open the site on a mobile device level
// class PhoneLevel extends Level {
//     constructor(xpos, ypos, color) {
//         super(xpos, ypos, color)
//         this.won = false;
//     }

//     draw() {

//     }
// }

//microphone input volume level
class VolumeLevel extends Level {
    constructor(xpos, ypos, color)
    {
        super(xpos, ypos, color)
        this.won = false;
        this.audioIn;
        this.hasStarted = false;
        this.rippleArray = [];
        this.threshold = .1;
    }

    start()
    {
        getAudioContext().resume();
        this.audioIn = new p5.AudioIn();
        //start monitoring audio input
        this.audioIn.start();
    }

    draw()
    {
        background(0);
        //check if you started monitoring mic input
        if (!this.hasStarted) {
            this.start();
            this.hasStarted = true;
        }

        //get the amplitude
        var level = this.audioIn.getLevel();
        console.log(level);

        //draw a ripple if audio input exceeds the min threshold
        if (level > this.threshold)
        {
            this.rippleArray.push(new Ripple(random(width), random(height)));
        }

        for (var i = 0; i < this.rippleArray.length; i++) {
            if (this.rippleArray[i].shouldDraw() == true){
                this.rippleArray.splice(i, 1);
                i--;
            }
        }
    }
}

//NOT A LEVEL CLASS
//class for the circle objects displayed in the volume level
class Ripple
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
		this.colour = color(random(255), random(255), random(255));
		this.alpha = 100;
		this.radius = 1;
	}

    //decide if this ripple should be drawn or not
	shouldDraw()
	{
        var shouldDelete = false

		fill(this.colour);
		this.colour.alpha = this.alpha;
		stroke(this.colour);
		ellipse(this.x, this.y, this.radius * 2, this.radius * 2);

		if (this.radius >= 30)
			shouldDelete = true;

		this.radius++;
		this.alpha -= 10

        return shouldDelete;
	}
}
