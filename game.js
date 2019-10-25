var backImage;
var coloredImages = [];

//class for the whole game, stores all the levels
class Game {
    constructor() {
        this.state = Game.states.levelSelect;
        this.currentLevel = -1;
        this.numLevelsComplete = 0;
        this.counter = 0;
        this.levels = [];
        //these are the actual levels
        this.levels.push(new ResizingLevel(width / 7, 100, color("#4AFFD3"), this));
        this.levels.push(new ConsoleLevel(2 * width / 7, 100, color("#79DA42"), this));
        this.levels.push(new VolumeLevel(3 * width / 7, 100, color("#FFEF00"), this));
        this.levels.push(new PhoneLevel(4 * width / 7, 100, color("#FFB02F"), this));
        this.levels.push(new CloseLevel(5 * width / 7, 100, color("#FF2F2F"), this));
        this.backButton = new BackButton(width / 7, 10, 30, 30);
    }

    draw() {
        //draw the level select screen
        if (this.state == Game.states.levelSelect)
            this.drawLevelSelect();

        //draw the current level screen
        else if (this.state == Game.states.runningLevel) {
            this.levels[this.currentLevel].draw();
            if (this.levels[this.currentLevel].isComplete == true) {
                this.numLevelsComplete++;
            }
            this.backButton.draw();
        }

        //draw the level complete screen
        else {
            this.drawLevelComplete()
            this.backButton.draw();
        }
    }

    //how to draw the level selection screen
    drawLevelSelect() {
        this.counter = 0;
        noStroke();
        for (var i = 0; i < this.levels.length; i++) {
            if (this.levels[i].isComplete) {
                noStroke();
                fill(this.levels[i].color);
            } else {
                noFill()
                strokeWeight(3)
                stroke(this.levels[i].color)
            }
            ellipse(this.levels[i].icon.x, this.levels[i].icon.y, width / 8, width / 8)
        }
    }

    //what to display when the user completes a level
    drawLevelComplete() {
        if (this.counter < 255) {
            this.counter += 2;
        }
        background(this.counter)

        textAlign(CENTER)
        textSize(72)
        noStroke()
        fill("#79DA42")
        text("COMPLETE", width / 2, height / 2)
    }


    detectClick() {
        //if you click the level completed screen
        if (this.state == Game.states.levelComplete) {
            this.state = Game.states.levelSelect;
        }

        //if you click the back button
        if (dist(this.backButton.x, this.backButton.y, mouseX, mouseY) <= this.backButton.width) {
            this.state = Game.states.levelSelect;
            this.levels[1].textEntry.text = "";
            this.levels[3].textEntry.text = "";
            return;
        }

        //if you click a level from the menu
        if (this.state == Game.states.levelSelect) {
            for (var i = 0; i < this.levels.length; i++) {
                if (dist(this.levels[i].icon.x, this.levels[i].icon.y, mouseX, mouseY) <= width / 8) {

                    this.state = Game.states.runningLevel;
                    this.currentLevel = i;

                    //color the back button
                    for (var i = 0; i < backImage.pixels.length; i++) {
                        backImage.pixels[i] = coloredImages[this.currentLevel][i];
                    }
                    backImage.updatePixels();
                    break;
                }
            }
        }
    }
}

Game.states = {
    levelSelect: 1,
    runningLevel: 2,
    levelComplete: 3
};


//class for the backbutton in each level
class BackButton {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = backImage
        this.img.loadPixels();
        this.images = [];
        this.pixelsCopy = this.img.pixels.slice(0);
    }

    //for responsive design sizing
    resize(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        image(this.img, this.x, this.y, this.width, this.height);
    }
}
