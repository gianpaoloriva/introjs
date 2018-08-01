var person = {

    firstname: '',
    lastname: '',
    greet: function(){
        return this.firstname + ' ' + this.lastname;
    }
}

var jhon = Object.create(person);

jhon.firstname = 'jhon';
jhon.lastname = 'Doe';

console.log(jhon.greet());
