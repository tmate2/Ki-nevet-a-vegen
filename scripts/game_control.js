/**
 * Player osztály
 * 
 * magasság 25,5 cm
 * szélesség 40 cm
 * mélység: 23 cm
 * 
 * 
 */
class Player {

    constructor(name, sf) {
        this.name = name;
        this.startField = sf;
        this.currentField = sf;
        this.isPlaying = false;
        this.steps = 0;
        this.puppetsInGoal = 0;
    }

    stepping(step) {
        this.steps += step;
        if (this.steps >= 34) {
            this.goal();
        } else {
            //kitöröljük az előző mezőről az játékost
            let lastField = document.getElementsByClassName(this.currentField);
            lastField[0].innerHTML = "";
            var newCurrentF = parseInt(this.currentField.replace("m", "")) + step;
            if( newCurrentF >= 32) {
                newCurrentF -= 32;
            }
            var newField = "m"+newCurrentF;
            collision(newField);
            this.currentField = "m"+newCurrentF;
        }
    }

    goal() {
        this.puppetsInGoal++;
                
        //let puppets = document.getElementById(this.name);
        //puppets.innerHTML = parseInt(puppets.textContent) - this.puppetsInGoal;

        let winnerPuppets = document.getElementById(this.name+"v");
        winnerPuppets.innerHTML = this.puppetsInGoal;
        this.isPlaying = false;
        this.steps = 0;
            
        let lastField = document.getElementsByClassName(this.currentField);
        lastField[0].innerHTML = "";

        this.currentField = this.startField;
    }

}

var playerList = [
    new Player("p2", "m8"),
    new Player("p1", "m0"),
    new Player("p3", "m16"),
    new Player("p4", "m24")
]

// gombok eltárolása, a dobott szám kiírása miatt
let btns = document.getElementsByTagName("button");
//aktuális játékos tárolása, a 0 és az 1 fel van cserélve
let currentPlayer = 1;


// játékos választó, gombnyomásonként váltja a játékosokat
function nextPlayer() {
    let dobas = doboKocka();
    
    btns[currentPlayer].innerHTML = dobas;
    if (!playerList[currentPlayer].isPlaying && dobas % 2 == 0) {
        firstStep();
    } else if (playerList[currentPlayer].isPlaying) {
        playerList[currentPlayer].stepping(dobas);
        let startF = document.getElementsByClassName(playerList[currentPlayer].currentField);
        startF[0].innerHTML = playerList[currentPlayer].name;
    }
    
    for(let i = 0; i < btns.length; i++)
        btns[i].disabled = true;

    switch (currentPlayer){
        case 1:
            currentPlayer = 0;
            break;
        case 0:
            currentPlayer = 2;
            break;
        case 2:
            currentPlayer = 3;
            break;
        default:
            currentPlayer = 1;
    }

    btns[currentPlayer].disabled = false;
}

function firstStep(){
    let puppets = document.getElementById(playerList[currentPlayer].name);
    puppets.innerHTML = parseInt(puppets.textContent) - 1;
    playerList[currentPlayer].isPlaying = true;

    let startF = document.getElementsByClassName(playerList[currentPlayer].startField);
    startF[0].innerHTML = playerList[currentPlayer].name;
}

function collision(newField) {
    let field = document.getElementsByClassName(newField);
    if (field[0].textContent != "") {
        for (plyr in playerList) {
            if(field[0].textContent == playerList[plyr].name){
                playerList[plyr].isPlaying = false;
                playerList[plyr].steps = 0;
                playerList[plyr].currentField = playerList[plyr].startField;

                let puppets = document.getElementById(playerList[plyr].name);
                puppets.innerHTML = parseInt(puppets.textContent) + 1;
                break;
            }
        }
    }
}

function doboKocka() {
    return Math.floor(Math.random() * 6) + 1;
}

