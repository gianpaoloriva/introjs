//Object Creation
var myCalendar = {
	Event: '',
	Date: '',
	CreateEvent: function () {
		return "hai creato il tuo evento: " + this.Event + " alla Data: " + this.Date;
	}
};


var = Object.create(myCalendar);
concerto.Event = "ed Sheeran";
concerto.Date = "Giugno 2019";

console.log(concerto.CreateEvent());
