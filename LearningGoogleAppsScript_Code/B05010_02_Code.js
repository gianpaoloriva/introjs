//Task 2.1
function greeting() {
  Browser.msgBox("Greeting", "Hello World!", Browser.Buttons.OK);
}

// Task 2.2
function greeting() {
  SpreadsheetApp.getActiveSpreadsheet()
    .toast("Hello World!", "Greeting");
}

// Task 2.3
function createMenu() {
  DocumentApp.getUi()
    .createMenu("PACKT")
    .addItem("Greeting", "greeting")
    .addToUi();
}

function greeting() {
  var ui = DocumentApp.getUi();
  ui.alert("Greeting", "Hello World!", ui.ButtonSet.OK);
}

// Task 2.4
function onOpen() {
  var htmlOutput = HtmlService
    .createHtmlOutput('<button onclick="alert(\'Hello
       World!\');">Click Me</button>')
    .setTitle('My Sidebar');
  
  DocumentApp.getUi()
    .showSidebar(htmlOutput);
}

// Task 2.5
// Index.html
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
  </head>
  <body>
    <button onclick="alert('Hello World!');">Click Me</button>
  </body>
</html>

// Code.gs
function onOpen(){
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Show Sidebar", "showSidebar")
    .addToUi();
}

function showSidebar() {
  DocumentApp.getUi()
    .showSidebar(
      HtmlService.createHtmlOutputFromFile('Index')
       .setTitle('Greetings')
    );
}

// Task 2.6
function onOpen(){
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Show Dialog", "showDialog")
    .addToUi();
}

function showDialog() {
  var html = HtmlService
    .createHtmlOutputFromFile('Index');
  DocumentApp.getUi()
    .showModalDialog(html, 'Greeting');
}

function showDialog() {
  var html = HtmlService.createHtmlOutputFromFile('Index');
  DocumentApp.getUi().showModelessDialog(html, 'Greeting');
}

// Task 2.7
function showDialog() {
  var ui = DocumentApp.getUi();
  var response = ui.prompt(
    'Greeting',
    'Will you enter your name below?',
    ui.ButtonSet.YES_NO
  );

  if (response.getSelectedButton() == ui.Button.YES) {
    Logger.log('Your name is %s.', response.getResponseText());
  } else if (response.getSelectedButton() == ui.Button.NO) {
    Logger.log('You clicked \'NO\' button');
  } else {
    Logger.log('You closed the dialog.');
  }

}

function debug(){
  var square = 0;
  for(var i = 0; i < 10; i++){
    square = i * i;
    Logger.log(square);
  }
}


