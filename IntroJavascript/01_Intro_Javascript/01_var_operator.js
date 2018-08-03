//Operators
var a = 1;
var b = 2;
var c = a + b;
console.log(c);

var a = 20;
a = a + 1;
a = a * 2;
console.log(a);

//ES6
// 1: var and let can change their value and const cannot change its value
// 2: var can be accessible anywhere in function but let and const can only be   accessible inside the block where they are declared.
const test01 = "My Const"; //won’t be reassigned
let test02 = "my Let"; //the variable may be reassigned

//Numbers & String
var a = "42";
var b = Number( a );
console.log( a );	// "42"
console.log( b );	// 42

//Variable + String
var amount = 99.99;
amount = amount * 2;
console.log( amount );		// 199.98
// convert `amount` to a string, and
// add "$" on the beginning
amount = "$" + String( amount );
console.log( amount );		// "$199.98"

// Built-in Method
var TAX_RATE = 0.08;	// 8% sales tax
var amount = 99.99;
amount = amount * 2;
amount = amount + (amount * TAX_RATE);
console.log( amount );				// 215.9784
console.log( amount.toFixed( 2 ) );	// "215.98"