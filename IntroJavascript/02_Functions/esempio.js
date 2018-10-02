function tax10(amount) {
    var taxRate = 0.10;
    var iva = amount * taxRate;
    var lordo = amount + iva;
    return lordo;
}

function tax22(amount) {
    var taxRate = 0.22;
    var iva = amount * taxRate;
    var lordo = amount + iva;
    return lordo;
}

function tax04(amount) {
    var taxRate = 0.04;
    var iva = amount * taxRate;
    var lordo = amount + iva;
    return lordo;
}

function final(inputFunction, amout) {
    var mioRisultato = inputFunction(amout);
    //console.log("il lordo è: " + mioRisultato);
    return "il lordo è: " + mioRisultato;
}


var stampa = final(tax04, 1000);
final(tax22, 1000);
final(tax10, 1000);

console.log(stampa);