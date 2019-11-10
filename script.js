/*Notes: This was my first real project with an attempt at an OOP-type design.  While it functionally works, with no errors that I have
been made aware of, it could be better.
TODO: Refactor everything
    -Too many global variables
    -Functions rely on side effects
    -CSS on the difficulty switch could be better
    -Maybe refactor CSS alltogether.
*/

var gameMode = "setup";  //setup computerTurn, playerTurn, Win, Lose
var turns = 0;
var strict = false;
var gameSequence = [];
var playerSequence = [];
var colors = ["green", "red", "blue", "yellow"];
var startButton = document.getElementById("start");
var turnScreen = document.getElementById("turns");
var colorButton = document.getElementsByClassName("colors");
var soundKey = {
    "green":new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    "red":new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    "blue":new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    "yellow":new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
};

async function playSound(color){
    await soundKey[color].play();
    return ;
}

document.getElementById("start").onclick = startGame;
document.getElementById("checkID").onclick = strictBox;

for (var i = 0; i < colorButton.length; i++) {
    colorButton[i].onclick = colorClick;
}


function startGame(){
    //Controls init of game settings, and function of the yellow start/reset button.
    // Game starts in setup mode, gameMode = "output" during the pattern setup.  Player can only press buttons if gameMode == "input"
    //After setup, the startButton displays RESET.  Pressing it gives the initial game settings, and returns the game to 'setup' mode.
    if (gameMode == "setup"){
        document.getElementById("checkID").disabled = true;
        gameMode = "output";
        addColor();
        startButton.innerHTML = "RESET";
    }

    if (gameMode == "reset"){
        turns = 0;
        turnScreen.innerHTML = displayTurns();
        document.getElementById("checkID").disabled = false;
        gameSequence = [];
        playerSequence = [];
        turnScreen.innerHTML = "00";
        startButton.innerHTML = "START";
        gameMode = "setup";
        startGame();
    }

    if (gameMode == "input"){
        turns = 0;
        turnScreen.innerHTML = displayTurns();
        document.getElementById("checkID").disabled = false;
        gameSequence = [];
        playerSequence = [];
        turnScreen.innerHTML = "00";
        startButton.innerHTML = "START";
        gameMode = "reset";

    }
}

function strictBox(){
    (strict == false? strict = true : strict = false);
}


function addColor(){
    if (gameMode == "output"){
        turns+=1;
        turnScreen.innerHTML = displayTurns();
        gameSequence.push(colors[Math.floor(Math.random()*colors.length)]);
        playColor(0);  //after color is added to the pattern, start the lightup/sound sequence.
    }
}

async function playColor(i){
    var color = gameSequence[i];

    setTimeout(async function(){
        document.getElementById(color).classList.add("light");
        await playSound(color);
        setTimeout(function(){
            document.getElementById(color).classList.remove("light");
        }, 500);    //gives a delay between the lightup effects when the pattern is shown to the player.  From the time the light is added
                    // wait .5 seconds to light it up, then another.5 seconds to remove it.
        i++;

        if ( i < gameSequence.length){
            playColor(i);  //continue to next color in pattern if available
        }else{
            setTimeout(function(){
                gameMode = "input";
            }, 750);
        }
    }, 1000);
}

function displayTurns(){
    return (turns <= 9 ?  ("0" + turns) :turns);
}


async function colorClick(){
    //TODO: Tie this to the click effect of the buttons, so the player doesnt get the CSS change outside of the "input" mode.
    //TODO:

    if (gameMode == "input"){ //make sure we are ready to accept user input
        var target = playerSequence.length;
        await playSound(this.id);
        if (this.id == gameSequence[target]){
            playerSequence.push(this.id);
            if (playerSequence.length == 20){ // win condition
                winGame();
            }else if (playerSequence.length == gameSequence.length){
                gameMode = "output";
                playerSequence = [];
                addColor();
            }
        }else{
            wrongMove();
        }
    }
}

function wrongMove(){
    gameMode = "output";
    playerSequence = [];
    if (strict == true){
        gameMode = "reset";
        turnScreen.innerHTML = "LOSE";
        startButton.innerHTML = "RESET";

    }else{
        playColor(0);
    }
}

function winGame(){
    gameMode = "output";
    playerSequence = [];
    gameMode = "reset";
    turnScreen.innerHTML = "WIN!";
    startButton.innerHTML = "RESET";
}