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
        this.levels.push(new ResizingLevel(100, 100, color("#79DA42"), this));
        this.levels.push(new ConsoleLevel(150, 100, color("#CEDA42"), this));
        this.levels.push(new VolumeLevel(200, 100, color("#FFEF00"), this));
        this.levels.push(new PhoneLevel(250, 100, color("#FFEF00"), this));
        this.backButton = new BackButton(10, 10, 30, 30);
    }

    draw() {
        //draw the level select screen
        if (this.state == Game.states.levelSelect)
            this.drawLevelSelect();

        //draw the current level screen
        else if (this.state == Game.states.runningLevel) {
            this.levels[this.currentLevel].draw();
            if (this.levels[this.currentLevel].isCompleted == true) {
                this.numLevelsComplete++;
            }
            this.backButton.draw();
        }

        //draw the level complete screen
        else {
            this.drawLevelComplete()
        }
    }

    //how to draw the level selection screen
    drawLevelSelect() {
        noStroke();
        for (var i = 0; i < this.levels.length; i++) {
            fill(this.levels[i].color);
            ellipse(this.levels[i].icon.x, this.levels[i].icon.y, 25, 25)
        }
    }

    //what to display when the user completes a level
    drawLevelComplete() {
        if (this.counter < 255)
            this.counter++
        background(this.counter)
        textAlign(CENTER)
        textSize(72)
        fill(0)
        text("COMPLETE", width/2, height/2)
    }

    //check if player selected a level
    detectClick() {
        //if you click the level completed screen, go to the main menu
        if (this.state == Game.states.levelComplete) {
            this.state = Game.states.levelSelect;
        }

        //if you click the back button
        if ( dist(this.backButton.x, this.backButton.y, mouseX, mouseY) <= this.backButton.width ) {
            this.state = Game.states.levelSelect;
            return;
        }

        for (var i = 0; i < this.levels.length; i++) {
            if (dist(this.levels[i].icon.x, this.levels[i].icon.y, mouseX, mouseY) <= 20) {
                //set game state to running the selected level
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
    resize(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        image(this.img, this.x, this.y, this.width, this.height);
    }
}
