/**
 * Player osztály
 * 
 */
class Player {

    constructor(displayedName, name, sf) {
        this.displayedName = displayedName;
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
            lastField[0].style.opacity = "70%";
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

        let winnerPuppets = document.getElementById(this.name+"v");
        winnerPuppets.innerHTML = this.puppetsInGoal;
        this.isPlaying = false;
        this.steps = 0;
            
        let lastField = document.getElementsByClassName(this.currentField);
        lastField[0].innerHTML = "";
        lastField[0].style.opacity = "70%";

        this.currentField = this.startField;
        winCheck(this.name);
    }

}

var playerList = [
    new Player("Grincs", "p2", "m8"),
    new Player("Rudolf", "p1", "m0"),
    new Player("Jack Skellington", "p3", "m16"),
    new Player("Mikulás", "p4", "m24")
];

// gombok eltárolása, a dobott szám kiírása miatt
let btns = document.getElementsByTagName("button");
let imgs = document.getElementsByTagName("img");
//aktuális játékos tárolása, a 0 és az 1 fel van cserélve
let currentPlayer = 1;


// játékos választó, gombnyomásonként váltja a játékosokat
function nextPlayer() {
    let dobas = doboKocka();
    
    btns[currentPlayer].style.backgroundImage = `url(imgs/${dobas}.png)`;
    
    if (!playerList[currentPlayer].isPlaying && dobas % 2 == 0) {
        firstStep();
    } else if (playerList[currentPlayer].isPlaying) {
        playerList[currentPlayer].stepping(dobas);
        let startF = document.getElementsByClassName(playerList[currentPlayer].currentField);
        if (playerList[currentPlayer].isPlaying) {
            startF[0].innerHTML = `<img src='imgs/${playerList[currentPlayer].name}.png'/>`;//+playerList[currentPlayer].name;
            startF[0].style.opacity = "100%";
        }
    }
    
    for(let i = 0; i < btns.length; i++){
        btns[i].disabled = true;
        btns[i].style.opacity = "60%";
    }

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
    btns[currentPlayer].style.opacity = "100%";
}

function firstStep(){
    let puppets = document.getElementById(playerList[currentPlayer].name);
    puppets.innerHTML = parseInt(puppets.textContent) - 1;
    playerList[currentPlayer].isPlaying = true;

    collision(playerList[currentPlayer].startField);

    let startF = document.getElementsByClassName(playerList[currentPlayer].startField);
    startF[0].innerHTML = `<img src='imgs/${playerList[currentPlayer].name}.png'/>`;
    startF[0].style.opacity = "100%";
}

function collision(newField) {
    let field = document.getElementsByClassName(newField);
    /*
    Az alapjan vizsgáljuk az ütközést, hogy az új mezőnek van-e már "gyermeke".
    Ha van ( childNodes.length > 0 ) akkor az csakis a kép miatt lehet, ezért
    annak az "src" attribútumából megkapjuk az eliminálandó karaktert...
    */
    if (field[0].childNodes.length > 0) {
        for (plyr in playerList) {
            if (field[0].childNodes[0].getAttribute("src") == `imgs/${playerList[plyr].name}.png`) {
                console.log("torolve: "+playerList[plyr]);
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

function winCheck(name) {
    //TODO: befejezni a gratuláló szöveget és újratölteni a zoldalt
    for (plyr in playerList) {
        if(playerList[plyr].name == name) {
            let playersPuppets =  document.getElementById(name+"v");
            if (playersPuppets.textContent == "4") {
                alert(`The winner is ${playerList[plyr].displayedName}. Congratulation!`);
            }
            break;
        }
    }
}
