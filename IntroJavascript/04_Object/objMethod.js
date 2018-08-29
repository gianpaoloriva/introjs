//Object Method
var person = {
	firstname: 'Gianpaolo',
	lastname: 'Riva',
	greet: function() {
		console.log('Hello, ' + this.firstname + ' ' + this.lastname);
	}
};

person.greet();

console.log(person['firstname']);