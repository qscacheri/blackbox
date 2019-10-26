var backImage;
var coloredImages = [];

//class for the whole game, stores all the levels
class Game {
    constructor(previousState) {
        this.currentLevel = -1;
        this.numLevelsComplete = 0;
        this.counter = 0;
        this.levels = [];
        this.boxImage = blackBoxImage;

        //these are the actual levels
        this.levels.push(new ResizingLevel(1 * width / 6, height / 2, color("#4AFFD3"), this));
        this.levels.push(new ConsoleLevel(2 * width / 6, height / 2, color("#79DA42"), this));
        this.levels.push(new VolumeLevel(3 * width / 6, height / 2, color("#FFEF00"), this));
        this.levels.push(new PhoneLevel(4 * width / 6, height / 2, color("#FFB02F"), this));
        this.levels.push(new CloseLevel(5 * width / 6, height / 2, color("#FF2F2F"), this));

        this.backButton = new BackButton(10, 10, 50, 50);
        this.hasVisitedLastLevel = false;
        this.particles = [];

        if (window.innerWidth <= 500)
        {
            this.setState(Game.states.onMobile);
            return;
        }

        if (typeof previousState === "undefined") return;

        previousState = JSON.parse(previousState);
        for (var i = 0; i < this.levels.length; i++) {
            this.levels[i].isComplete = previousState.completeLevels[i];
        }
        this.hasVisitedLastLevel = previousState.hasVisitedLevel;

        this.setState(Game.states.levelSelect);

    }

    draw() {
        //console.log(this.state);
        if (this.state == Game.states.onMobile) {
            noStroke();
            fill(255)
            textSize(height * .05)
            textAlign(CENTER, CENTER);
            text("The code is: 835", width / 2, height / 2);
        }

        //draw the level select screen
        if (this.state == Game.states.levelSelect)
            this.drawLevelSelect();

        //draw the current level screen
        else if (this.state == Game.states.runningLevel) {
            this.levels[this.currentLevel].draw();
            this.backButton.draw();
        }

        //draw the level complete screen
        else if (this.state == Game.states.levelComplete) {
            this.drawLevelComplete()
            this.backButton.draw();
            this.numLevelsComplete++;
        } else if (this.state == Game.states.lastLevel) {
            this.drawLastLevel();
        } else if (this.state == Game.states.gameComplete) {
            this.drawGameComplete();
        }

    }

    //how to draw the level selection screen
    drawLevelSelect() {
        textFont(font)
        textSize(height / 7);
        textAlign(LEFT, TOP);
        fill(0);
        image(this.boxImage, 350, 10, this.boxImage.width * .2, this.boxImage.height * .2);
        stroke(255);
        text("BLACK", 10, 15);
        textSize(height / 10);
        text("BOX", 1.5 * textWidth("BLACK"), 15);

        this.counter = 0;
        noStroke();
        for (var i = 0; i < this.levels.length; i++) {
            if (this.levels[i].isComplete) {
                noStroke();
                fill(this.levels[i].color);
            }
            else {
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
        textFont(font);
        textAlign(CENTER)
        textSize(72)
        noStroke()
        fill(this.levels[this.currentLevel].color)
        text("COMPLETE", width / 2, height / 2)
    }

    drawLastLevel() {
        this.drawLevelSelect();
        textAlign(CENTER);
        fill(255);
        text("ALMOST DONE. . .", width / 2, height * .7);
    }

    drawGameComplete() {
        textSize(height / 5);
        fill(255);
        text("YOU WON", width / 2, height / 5);

        this.particles.push( new Particle(random(width), random(-50, 0), this) );
        
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();

            //disgard particles that are off screen
            if (this.particles[i].isDone()) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    detectClick() {
        //if you click the level completed screen
        if (this.state == Game.states.levelComplete) {
            this.setState(Game.states.levelSelect);
        }

        //if you click the back button
        else if (dist(this.backButton.x, this.backButton.y, mouseX, mouseY) <= this.backButton.width) {
            this.setState(Game.states.levelSelect);
        }

        //if you click a level from the menu
        else if (this.state == Game.states.levelSelect) {
            for (var i = 0; i < this.levels.length; i++) {
                if (dist(this.levels[i].icon.x, this.levels[i].icon.y, mouseX, mouseY) <= width / 8) {

                    if (this.levels[i].isComplete)
                        this.setState(Game.states.levelComplete);
                    else
                        this.setState(Game.states.runningLevel);

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

    resized() {
        for (var i = 0; i < this.levels.length; i++) {
            this.levels[i].icon.x = (i + 1) * (width / 6);
        }
        this.levels[1].resized();
        this.levels[3].resized();

    }

    setState(newState) {
        this.state = newState;
        this.saveGame(false);
        this.levels[1].textEntry.text = "";
        this.levels[3].textEntry.text = "";
        if (this.state != Game.states.levelSelect)
            document.getElementById("button-container").style.visibility = "hidden";
        else {
            document.getElementById("button-container").style.visibility = "visible";
        }
        //console.log(this.state);

        for (var i = 0; i < this.levels.length; i++) {
            //console.log(this.levels[i].isComplete);
            if (this.levels[i].isComplete === false)
                return;
        }
        if (this.state != Game.states.levelSelect || this.state == Game.states.lastLevel)
            return;

        this.state = Game.states.lastLevel;
    }

    saveGame(updateVisited) {
        var data = {
            completeLevels: [],
            hasVisitedLevel: updateVisited //just for closeLevel
        };

        //keep track of game progress when back button is clicked
        for (var i = 0; i < this.levels.length; i++) {
            data.completeLevels[i] = this.levels[i].isComplete;
        }

        Cookies.set("game-data", JSON.stringify(data));
    }
}

Game.states = {
    levelSelect: 1,
    runningLevel: 2,
    levelComplete: 3,
    onMobile: 4,
    lastLevel: 5,
    gameComplete: 6
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
