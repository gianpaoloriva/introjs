var myarr = [1, 232, 232, 3434, 565, 554, 343, 3356, 7743, 2245, 6454];
var newArrSum = [];
console.log("il numero di valori è: " + myarr.length);

for (var i = 0; i < myarr.length; i++){
    var myval = myarr[i] * 2;
    var k = i;
    k++;
    //console.log(k);
    var sum = myarr[i] + myarr[k];
    newArrSum.push(sum);
    console.log("Il valore dell'array è: " + myarr[i]);
    console.log("Il valore moltiplicato dell'array è: " + myval);
    console.log("la somma è : " + sum);
    
}

console.log(newArrSum);
// myarr.forEach(function (element) {
//     console.log("il valore element è: " + element);
// });

//myarr.sort();
// myarr.push(377);
// console.log("inserisco 377: " + myarr);
// myarr.sort();
// console.log("ordino array: " + myarr);
// myarr.pop();
// console.log("tolgo ultimo valore: " + myarr);