// functions and arrays
var arr = [];

arr.push(function() {
	console.log('Hello world 1');
});
arr.push(function() {
	console.log('Hello world 2');
});
arr.push(function() {
	console.log('Hello world 3');
});

arr.forEach(function(item) {
	item();
});


//lenght,index
[].length             // => 0: the array has no elements
['a','b','c'].length  // => 3: highest index is 2, length is 3”
