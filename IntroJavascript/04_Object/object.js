// object properties
// var empty = {};                           // An object with no properties
// var point = { x:0, y:0 };                 // Two properties
//var point2 = { x:point.x, y:point.y+1 };  // More complex values
var book = {
    maintitle: "JavaScript",
    pageNumber: 343,         // Property names include spaces,
    subtitle: "The Definitive Guide",  // and hyphens, so use string literals
    for: "all audiences",               // for is a reserved word, so quote
    author: {                             // The value of this property is
        firstname: "David",               // itself an object.  Note that
        surname: "Flanagan"               // these property names are unquoted.
    },
    city: ["Milano", "New York", "Londra"]
};

var book2 = {
    myfavoritesBook: book.maintitle,
    pageReads: book.pageNumber
};

var myLength = book.city.length;
console.log(myLength);

for (i = 0; i < myLength; i++){
    console.log(book.city[i]);
}


// console.log(book.city.forEach(function (element) {
//     console.log(element);
// }));

book.author.firstname = "Gianpaolo";
book.author.surname = "Riva";

console.log(book);

// and methods
// var obj = {
//     greet: 'Hello'
// };

// console.log(obj.greet);
// console.log(obj['greet']);
// var prop = 'greet';
// console.log(obj[prop]);


//Object list
var obj = {a: "hello world",b: 42,c: true};
obj.a;		// "hello world"
obj.b;		// 42
obj.c;		// true

obj["a"];	// "hello world"
obj["b"];	// 42
obj["c"];	// true



