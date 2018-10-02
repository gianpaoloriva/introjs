function calcoloTasse() {

    var amount = 99.00;
    var taxRate = 0.10;

    var iva = amount * taxRate;
    var lordo = amount + iva;

    if (taxRate === 0.22 && amount > 100) {
        console.log("la tua IVA è Standard");
    }
    else if (taxRate === 0.10)
    {
        console.log("la tua IVA è 10%");
    }
    else if (taxRate === 0.04) {
        console.log("la tua IVA è Minima");
    }
    else {
        console.log("la tua IVA non è Standard");
    }
    
    return "il Risultato è " + lordo.toFixed(2);
}

// console.log(calcoloTasse(99.99, 0.22));
// console.log(calcoloTasse(100.89, 0.10));
// console.log(calcoloTasse(1334.4, 0.04));
// console.log(calcoloTasse(1334.4, 0.45));
console.log(calcoloTasse());



