function Person(firstname, lastname) {	
	this.firstname = firstname;
	this.lastname = lastname;
}

Person.prototype.greet = function() {
	console.log('Hello, ' + this.firstname + ' ' + this.lastname);
};

var john = new Person('Gianpaolo', 'Riva');
john.greet();

var jane = new Person('Bill', 'Gates');
jane.greet();

console.log(john.prototype);
console.log(jane.prototype);
console.log(john.prototype === jane.prototype);
