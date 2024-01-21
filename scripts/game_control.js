/**
 * Player osztály
 * A karakterek paramétereit és lépéseit kezelő programegység
 */
class Player {

    /**
     * 
     * @param {string} displayedName    Karakter neve, megegyezik a dobókockájánál megjelenő névvel
     * @param {string} name             Kódon belül ezzel hivatkozunk a karakterre [p{1-4}]
     * @param {string} startField       Kezdő mező. A karakter színéhez tartozó mező [m{0-31}]
     */
    constructor(displayedName, name, startField) {
        this.displayedName = displayedName;     // Karakter neve
        this.name = name;                       // Karaktert kódon belül azonosító név
        this.startField = startField;           // Kezdő mező
        this.currentField = startField;         // Aktuális elhelyezkedése (alap esetben spawn után a kezdő mező)
        this.isPlaying = false;                 // Karakter állapota, hogy játékban van-e
        this.steps = 0;                         // Megtett lépések száma
        this.puppetsInGoal = 0;                 // Célbaérések száma
    }

    /**
     * 
     * @param {Number} step     Dobókockával dobott érték. Ennyivel léptetjük a karakterünket
     */
    stepping(step) {
        this.steps += step;
        // Egy kör megnyeréséhez 34 lépést kell megtennie egy karakternek, hogy körbeérjen.
        if (this.steps >= 34) {
            this.goal(); // Ha 34 vagy több lépésig jutott a karakter akkor célbaért.
        } else {
            // Kitöröljük az előző mezőről az játékost (eltávolítjuk a képét és visszaállítjuk az átlátszóságot)
            let lastField = document.getElementsByClassName(this.currentField);
            lastField[0].innerHTML = "";
            lastField[0].style.opacity = "70%";
            var newCurrentF = parseInt(this.currentField.replace("m", "")) + step;

            // A mezők 'm31'-ig vannak számozva, így az "utolsón" túlhaladva az elejére jutunk
            if( newCurrentF >= 32) {
                newCurrentF -= 32;
            }
            var newField = "m"+newCurrentF;
            // Ellenőrizzük és kezeljük az esetleges ütközéseket
            collision(newField);
            this.currentField = "m"+newCurrentF;
        }
    }

    /**
     * Célbaérést kezelő metódus
     */
    goal() {
        // Növeljük a célbaért bábok számát, majd frissítjük a célmező értékét
        this.puppetsInGoal++;

        let winnerPuppets = document.getElementById(this.name+"v");
        winnerPuppets.innerHTML = this.puppetsInGoal;
        // Alaphelyzetbe állítjuk a karakter paramétereit
        this.isPlaying = false;
        this.steps = 0;
        
        // Kitöröljük a karaktert a legutóbbi helyéről és visszaállítjuk az utolsó mezőt
        let lastField = document.getElementsByClassName(this.currentField);
        lastField[0].innerHTML = "";
        lastField[0].style.opacity = "70%";

        // Visszaállítjuk az aktuálismezőt a kezdőmezőre, majd ellenőrizzük, hogy győzött-e a karakter
        this.currentField = this.startField;
        winCheck(this.name);
    }

}


/**
 * Player objektumokat tartalmazó lista
 */
var playerList = [
    new Player("Erdei birodalom harcosa", "p2", "m8"),
    new Player("Napfénykirályság lovagja", "p1", "m0"),
    new Player("Északi hegyi törp", "p3", "m16"),
    new Player("Keleti vörös asszaszin", "p4", "m24")
];

// Gombok eltárolása, a dobott szám kiírása miatt
let btns = document.getElementsByTagName("button");
let imgs = document.getElementsByTagName("img");
// Aktuális játékos tárolása, a 0 és az 1 fel van cserélve
let currentPlayer = 1;


/**
 * Karakterváltó metódus, dobásonként váltogatja a karaktereket és irányítja a játék menetét
 */
function nextPlayer() {
    let dobas = doboKocka();
    
    // Dobás után a dobó karakterhez tartózó gomb megjelenését a dobás értékéhez állítja
    btns[currentPlayer].style.backgroundImage = `url(imgs/${dobas}.png)`;
    
    // Ha a karakter még nincs játékban, de páros számot dobott, akkor spawnoltatjuk
    if (!playerList[currentPlayer].isPlaying && dobas % 2 == 0) {
        firstStep();
    } else if (playerList[currentPlayer].isPlaying) {
        // Ha már játékban van akkor léptetjük
        playerList[currentPlayer].stepping(dobas);
        if (playerList[currentPlayer].isPlaying) {
            // Ha léptetés után is játékban marad a karakter (nem ér célba), akkor megjelenítjük az új helyén helyén
            let currentF = document.getElementsByClassName(playerList[currentPlayer].currentField);
            currentF[0].innerHTML = `<img src='imgs/${playerList[currentPlayer].name}.png'/>`;
            currentF[0].style.opacity = "100%";
        }
    }
    
    // Letitjuk a dobókocka gombokat majd kiválasztjuk a következő karaktert
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

    // A következő karakter gombját engedélyezzük, hogy tudjon dobni
    btns[currentPlayer].disabled = false;
    btns[currentPlayer].style.opacity = "100%";
}


/**
 * Spawnolásért felelős metódus
 */
function firstStep() {
    // A karaktert játékra állítjük és a hozzá tartózó számlálót csökkentjük a táblán
    // Megjegyzés: Ez a számláló a hátralévő karaktereket jelzi, a célbaért és a pályán lévőket nem számolja
    let puppets = document.getElementById(playerList[currentPlayer].name);
    puppets.innerHTML = parseInt(puppets.textContent) - 1;
    playerList[currentPlayer].isPlaying = true;

    // Ha egy másik karakter a kezdő mezőn tartózkodik, akkor azt elimináljuk
    collision(playerList[currentPlayer].startField);

    // Megjelenítjük a karaktert a kezdőmezőjén
    let startF = document.getElementsByClassName(playerList[currentPlayer].startField);
    startF[0].innerHTML = `<img src='imgs/${playerList[currentPlayer].name}.png'/>`;
    startF[0].style.opacity = "100%";
}


/**
 * Ez a metódus felel a kiütésekért
 * @param {string} newField -> Egy karakter dobás utáni következő mezője
 */
function collision(newField) {
    /* Az alapjan vizsgáljuk az ütközést, hogy az új mezőnek van-e már "gyermeke".
     * Ha van ( childNodes.length > 0 ) akkor az csakis a "kép" miatt lehet, ezért
     * annak az "src" attribútumából megkapjuk az eliminálandó karaktert...
     */
    let field = document.getElementsByClassName(newField);
    if (field[0].childNodes.length > 0) {
        for (plyr in playerList) {
            if (field[0].childNodes[0].getAttribute("src") == `imgs/${playerList[plyr].name}.png`) {
                // A kiütött karaktert alaphelyzetbe állítjük és a hozzá tartozó számlálót megnöveljük
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


/**
 * Dobókockát szimuláló függvény
 * @returns Number -> 1-6 közötti egészszámot ad vissza
 */
function doboKocka() {
    return Math.floor(Math.random() * 6) + 1;
}


/**
 * Győzelmet vizsgáló metódus
 * @param {String} name -> A karaktert azonosító név (p{1-4})
 */
function winCheck(name) {
    //TODO: befejezni a gratuláló szöveget és újratölteni a zoldalt
    for (plyr in playerList) {
        if (playerList[plyr].name == name) {
            let playersPuppets =  document.getElementById(name+"v");
            if (playersPuppets.textContent == "4") {
                alert(`The winner is ${playerList[plyr].displayedName}. Congratulation!`);
            }
            break;
        }
    }
}
