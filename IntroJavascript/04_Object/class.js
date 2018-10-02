class Person {
    constructor(firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
    }
    greet() {
        console.log('Hello, ' + this.firstname + ' ' + this.lastname);
    }
}

var person = new Person();
person.firstname = "Gianpaolo";
person.lastname = "Riva";

console.log(person.greet());
