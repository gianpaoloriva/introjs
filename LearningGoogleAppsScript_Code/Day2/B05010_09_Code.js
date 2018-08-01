function main(){
  createTrigger_("doSomeThing",10);
  doSomeThing();
}


function doSomeThing() {
  var startTime = +new Date();
  var elapsedTime = +new Date() - startTime;
  
  // Loop variable.
  var i = 'Load value from spreadsheet cell.'
  
  for(; elapsedTime < 300000; i++){ // 5 minutes
    // Your process goes here.
    …
    …
    …
    …
    …
    …
    // At end of the loop
    // If everything completed successfully
    deleteTriggers_();

    // Else
    elapsedTime = +new Date() - startTime;
  }

  // Store value of 'i' in spreadsheet cell."
}


// Helper functions
function deleteTriggers_(){
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger){
    ScriptApp.deleteTrigger(trigger);
    // Wait a moment before calling deleteTrigger again.
    // Otherwise you may get warning message something like that
    // "Too many service invocation at a time..."
    Utilities.sleep(1000); // One second

  });

};


function createTrigger_(funcName,minutes){
  deleteTriggers_();
  ScriptApp.newTrigger(funcName).timeBased()
    .everyMinutes(minutes).create();
}


function test(){

  var pricelist = Chapter8.getPrice();
  
  Logger.log(pricelist);
}


function onOpen(e){
  SpreadsheetApp.getUi().createAddonMenu()
  .addItem("Show Sidebar", "showSidebar")
  .addToUi();
}


function onInstall(e){
  onOpen(e);
}


/**
 *  Opens sidebar in the document containing the add-on's
 *   user interface.
 *
 */
function showSidebar() {
  SpreadsheetApp.getUi().showSidebar(
    HtmlService.createHtmlOutputFromFile('Sidebar')
  );
}
