// function statement
function funzione1(text) {
	var latuavar = 'hi ' + text;
	return latuavar;
}


var gp = "Gianpaolo";
//funzione1(gp);
//greet();
function funzione2(text) {
	var pippo = 2;
	console.log('Ciao a Tutti!! da ' + text + " " + pippo);
}
//funzione2(gp);

// // functions are first-class
function funzionefinale(funzioninput, text) {
	//var pippo = "come vogliamo chiamarlo";
	funzioninput(text);
	console.log(funzioninput(text));
}
// var text01 = "testo01";
// var text02 = "Testo02";

funzionefinale(funzione1,gp);
// funzionefinale(funzione2,text02);

// function expression
// var greetMe = function() {
// 	console.log('Hi GP!');
// }
// greetMe();

// function greetMe2() {
// 	console.log('Hi GP!');
// }

// greetMe2();

// it's first-class
//logGreeting(greetMe);

// // use a function expression to create a function on the fly
// logGreeting(function() {
// 	console.log('Hello GP!');
// });