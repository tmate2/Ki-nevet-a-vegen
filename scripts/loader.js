/**
 * Az oldal betöltésekor lefutó függvény, ami tiltja a gombokat és megjeleníti a szabályzatot.
 */
function welcome() {
    killBtns();
}


/**
 * Betöltéskor a játék elkezdése előtt letiltja az összed dobókocka gombot.
 * Erre azért van szükség, mert újratöltésnél előfordulhat, hogy valamelyik gomb nem tiltódik le
 */
function killBtns() {
    var btns = document.getElementsByTagName("button");
    for(btn in btns) {
        btns[btn].disabled = true;
    }
    btns[1].disabled = false;
}


//TODO: játékszabályzat kiírása alert ablakban
function rules() {
    //TODO: fogalmazd meg
}