
function welcome() {
    killBtns();
}

// must have tiltani az összes gombot, mert valami oknál fogva,
// ha újratöltjük az oldalt, akkor valamelyik bekapcsolva marad...
function killBtns() {
    var btns = document.getElementsByTagName("button");
    for(btn in btns) {
        btns[btn].disabled = true;
    }
    btns[1].disabled = false;
}

//TODO: játékszabályzat kiírása alert ablakban