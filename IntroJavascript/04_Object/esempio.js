var Auto = {
    Alimentazione: "",
    Sedili: "",
    Nome: "",
    Velocità: 150,

    Accesione: function (Nome) {
        //azione attuatore dell'accensione
        //Aziona accensione cruscotto --> interrogo sensore velocità//Interrogo Giri Motore
        //aziona Accensione Radio
        
        return "la tua macchina si è accesa " + Nome + " " + this.Nome;
    },
    SiriDescriviAuto: function () {
        return ("la tua auto è composta da: "
            + this.Sedili + " Sedili "
            + this.Alimentazione
            + " Alimentazione e si chiama: "
            + this.Nome); 
    }
};

var Toyota = Object.create(Auto);
Toyota.Nome = "Auris";
Toyota.Alimentazione = "Hybrid";
Toyota.Sedili = 5;

var Fiat = Object.create(Auto);
Fiat.Nome = "500";
Fiat.Alimentazione = "Benzina";
Fiat.Sedili = 4;

console.log(Toyota.SiriDescriviAuto());
console.log(Toyota.Accesione("Gianpaolo"));

console.log(Fiat.SiriDescriviAuto());
console.log(Fiat.Accesione("Gianpaolo"));