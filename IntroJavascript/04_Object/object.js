// object properties
var empty = {};                           // An object with no properties
var point = { x:0, y:0 };                 // Two properties
var point2 = { x:point.x, y:point.y+1 };  // More complex values
var book = {
	"main title": "JavaScript",           // Property names include spaces,
	'sub-title': "The Definitive Guide",  // and hyphens, so use string literals
    "for": "all audiences",               // for is a reserved word, so quote
    author: {                             // The value of this property is
        firstname: "David",               // itself an object.  Note that
        surname: "Flanagan"               // these property names are unquoted.
    }
};

// and methods
var obj = {
    greet: 'Hello'
};

console.log(obj.greet);
console.log(obj['greet']);
var prop = 'greet';
console.log(obj[prop]);


//Object list
var obj = {a: "hello world",b: 42,c: true};
obj.a;		// "hello world"
obj.b;		// 42
obj.c;		// true

obj["a"];	// "hello world"
obj["b"];	// 42
obj["c"];	// true



