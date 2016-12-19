var plotno = document.getElementById("canvas");
var context = plotno.getContext("2d");


var szerokosc = plotno.width;
var wysokosc = plotno.height;

var rozmiarBloku = 10;
var szerokoscWBlokach = szerokosc / rozmiarBloku;
var wysokoscWBlokach = wysokosc / rozmiarBloku;

var wynik = 0;

var rysujObramowanie = function (){
    context.fillStyle = "Red";
    context.fillRect(0, 0, szerokosc, rozmiarBloku);
    context.fillRect(0, wysokosc - rozmiarBloku, szerokosc, rozmiarBloku);
    context.fillRect(0, 0, rozmiarBloku, wysokosc);
    context.fillRect(szerokosc - rozmiarBloku, 0, rozmiarBloku, wysokosc);
};

var rysujWynik = function(){
    context.font = "20px Courier";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Wynikl: " + wynik, rozmiarBloku, rozmiarBloku);
};

var koniecGry = function() {
    clearInterval(IdPrzedzialu);
    context.font = "60px Courier";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game Over ", szerokosc / 2, wysokosc / 2);
};
var okrag = function (x, y, promien, wypelnijOkrag) {
    context.beginPath();
    context.arc(x, y, promien, 19, Math.PI *2, false);
    if (wypelnijOkrag){
        context.fill();
    }   else {
        context.stroke();
    }
};

var Blok = function (kolumna, wiersz){
    this.kolumna = kolumna;
    this.wiersz = wiersz;
};

Blok.prototype.rysujKwadrat = function (kolor) {
    var x = this.kolumna * rozmiarBloku;
    var y = this.wiersz * rozmiarBloku;
    context.fillStyle = kolor;
    context.fillRect(x, y, rozmiarBloku, rozmiarBloku);
};

Blok.prototype.rysujOkrag = function (kolor) {
    var srodekX = this.kolumna * rozmiarBloku + rozmiarBloku / 2;
    var srodekY = this.wiersz * rozmiarBloku + rozmiarBloku /2;
    context.fillStyle = kolor;
    okrag(srodekX, srodekY, rozmiarBloku / 2, true);
};

Blok.prototype.porownaj = function (innyBlok) {
    return this.kolumna === innyBlok.kolumna && this.wiersz === innyBlok.wiersz;
};

var waz = function () {
    this.segmenty = [
        new Blok(7, 5),
        new Blok(6, 5),
        new Blok(5, 5)
    ];

    this.kierunek = "prawa";
    this.nastepnyKierunek = "prawa";
};

    waz.prototype.rysuj = function () {
        for (var i = 1; i < this.segmenty.length; i++){
            this.segmenty[i].rysujKwadrat("blue");
        }
    };

    waz.prototype.przesun = function () {
        var glowa = this.segmenty[0];
        var  nowaGlowa;

        this.kierunek = this.nastepnyKierunek;

        if (this.kierunek === "prawa"){
            nowaGlowa = new Blok(glowa.kolumna + 1, glowa.wiersz);
        }else if (this.kierunek === "dol"){
            nowaGlowa = new Blok(glowa.kolumna, glowa.wiersz + 1);
        }else if (this.kierunek === "lewa"){
            nowaGlowa = new Blok(glowa.kolumna - 1, glowa.wiersz);
        }else if (this.kierunek === "gora"){
            nowaGlowa = new Blok(glowa.kolumna, glowa.wiersz - 1);
        }
            if (this.wykrywajKolizje(nowaGlowa)){
                koniecGry();
                return;
            }
        this.segmenty.unshift(nowaGlowa);
        if (nowaGlowa.porownaj(jablko.pozycja)) {
            wynik++;
            jablko.przenies();
        }   else {
            this.segmenty.pop();
        }
    };

    waz.prototype.wykrywajKolizje = function (glowa) {
        var lewaKolizja = (glowa.kolumna === -1);
        var goraKolizja = (glowa.wiersz === -1);
        var prawaKolizja = (glowa.kolumna === szerokoscWBlokach);
        var dolKolizja = (glowa.wiersz === wysokoscWBlokach);

        var scianaKolizja = lewaKolizja || goraKolizja || prawaKolizja || dolKolizja;

        var ogonKolizja = false;

        for (var i = 0; i < this.segmenty.length; i++){
            if (glowa.porownaj(this.segmenty[i])){
                ogonKolizja = true;
            }
        }

        return scianaKolizja || ogonKolizja;
    };

    waz.prototype.ustawKierunek = function (nowyKierunek) {
        if (this.kierunek === "gora" && nowyKierunek === "dol") {
            return;
        } else if (this.kierunek === "prawa" && nowyKierunek === "lewa"){
            return;
        }      else if (this.kierunek === "dol" && nowyKierunek === "gora"){
            return;
        }   else if (this.kierunek === "lewa" && nowyKierunek === "prawa"){
            return;
        }
        this.nastepnyKierunek = nowyKierunek;
    };

    var jablko = function () {
        this.pozycja = new Blok(10, 10);
    };

    jablko.prototype.rysuj =function () {
        this.pozycja.rysujOkrag("LimeGreen");
    };

    jablko.prototype.przenies = function () {
        var losowaKolumna = Math.floor(Math.random() * (szerokoscWBlokach - 2)) + 1;
        var losowyWiersz = Math.floor(Math.random() * (wysokoscWBlokach -2)) + 1;
        this.pozycja = new Blok(losowaKolumna, losowyWiersz);
    };

    var waz = new waz();
    var jablko = new jablko();

    var IdPrzedzialu = setInterval(function () {
        context.clearRect(0, 0, szerokosc, wysokosc);
        rysujWynik();
        waz.przesun();
        waz.rysuj();
        jablko.rysuj();
        rysujObramowanie();

    }, 100);

    var kierunki = {
        37: "lewa",
        38: "gora",
        39: "prawa",
        40: "dol"
    };

    $("body").keydown(function (zdarzenie) {
        var nowyKierunek = kierunki[zdarzenie.keyCode];
        if (nowyKierunek !== undefined){
            waz.ustawKierunek(nowyKierunek);
        }

    });
