// Task 4.1
function createCalendarEventsFromSheetData() {
  // Event sheet columns, 0 based.
  const TITLE = 0;
  const START_TIME = 1;
  const END_TIME = 2;
  const DESCRIPTION = 3;
  const LOCATION = 4;
  const SEND_INVITES = 5;
  const GUESTS = 6;
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Events");
  var data = sheet.getDataRange().getValues();
  var header = data.shift();

  var options = {
    description : '',
    location : '',
    sendInvites : false,
    guests : ''
  };
  
  for(var i in data){
    options.description = data[i][DESCRIPTION];
    options.location = data[i][LOCATION];
    options.sendInvites = data[i][SEND_INVITES];
    options.guests = data[i][GUESTS];
    
    var title = data[i][TITLE];
    var startTime = data[i][START_TIME];
    var endTime = data[i][END_TIME];
    CalendarApp.getDefaultCalendar().createEvent(title, startTime, endTime, options);
  }  
}

// Task 4.2
function createEventsFromCsvData(){
  // CSV columns, 0 based.
  const TITLE = 0;
  const START_TIME = 1;
  const END_TIME = 2;
  const DESCRIPTION = 3;
  const LOCATION = 4;
  const SEND_INVITES = 5;
  const GUESTS = 6;
  
  // Put key/id of the csv file placed in Drive.
  var blob = DriveApp.getFileById("[[ CSV file id ]]").getBlob();
  var str = blob.getDataAsString();
  var data = Utilities.parseCsv(str);

  // Now data is a two dimensional array
  
  data.shift();// Remove header
  
  var options = {
    description : '',
    location : '',
    sendInvites : false,
    guests : ''
  };
  
  for(var i in data){
    
    if(!data[i][0]) continue;
    
    options.description = data[i][DESCRIPTION];
    options.location = data[i][LOCATION];
    options.sendInvites = data[i][SEND_INVITES];
    options.guests = data[i][GUESTS];
    
    var title = data[i][TITLE];
    var startTime = data[i][START_TIME];
    var endTime = data[i][END_TIME];
    
    try{
      CalendarApp.getDefaultCalendar().createEvent(title, startTime, endTime, options);
    } catch(e){
      Logger.log(e.message);
    }
    
  }
}

// Task 4.3
/**
 *  Logs all of your calendars with ids.
 *
 */
function listCalendars() {
  var calendars, pageToken;
  do {
    calendars = Calendar.CalendarList.list({
      maxResults: 100,
      pageToken: pageToken
    });
    if (calendars.items && calendars.items.length > 0) {
      for (var i = 0; i < calendars.items.length; i++) {
        var calendar = calendars.items[i];
        Logger.log('%s (ID: %s)', calendar.summary, calendar.id);
      }
    } else {
      Logger.log('No calendars found.');
    }
    pageToken = calendars.nextPageToken;
  } while (pageToken);
}

// Task 4.4
function listEventsFromOneCalendar() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ExistingEvents");
  
  var source = "[[ source calendar email id ]]";
  var srcCalId = Calendar.Calendars.get(source).id;

  var syncdays = 30;
  var now = new Date();
  var min = new Date(now.getFullYear(),now.getMonth(),now.getDate());
  var max = new Date(now.getFullYear(),now.getMonth(),now.getDate() + syncdays);
  
  var srcEvents = Calendar.Events.list(srcCalId, {
    timeMin: min.toISOString(),
    timeMax: max.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  }).items;

  // UPDATE events.
  var output = [];
  srcEvents.forEach(function(e){
    var event = [];
    event.push(e.summary || "");
    event.push(e.start.dateTime || "");
    event.push(e.end.dateTime || "");
    event.push(e.description || "");
    event.push(e.location || "");
    output.push(event);
  });
  
  var header = ["Title/Subject", "Start Time", "End Time", "Description", "Location"];
  output.unshift(header);
  sheet.clearContents();
  sheet.getRange(1, 1, output.length, header.length).setValues(output);
};

// Task 4.5
/**
*
*  Replace Source and Destination with your own calendars name.
*
*  You should have write access in destination calendar,
*   in otherwords it should be created by you.
*
*/
function syncEvents() {
  const RATE_LIMIT = 10; // Milliseconds
  
  var source = "[[ Source ]]"; // Source calendar email id.
  var destination = "Destination"; // Name of the destination calendar.

  var srcCalId = Calendar.Calendars.get(source).id;
  var dstCalId = CalendarApp.getCalendarsByName(destination)[0].getId();

  var syncdays = 30;
  var now = new Date();
  var min = new Date(now.getFullYear(),now.getMonth(),now.getDate());
  var max = new Date(now.getFullYear(),now.getMonth(),now.getDate() + syncdays);
  
  var srcEvents = Calendar.Events.list(srcCalId, {
    timeMin: min.toISOString(),
    timeMax: max.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  }).items;

  var allDstEvents = Calendar.Events.list(dstCalId, {
    timeMin: min.toISOString(),
    timeMax: max.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  }).items;
  
  var dstEvents = allDstEvents.filter(function(event){
    return /\[sync:\w+/.test(event.summary)?true:false;
  });

  
  // UPDATE events.
  for(var d in dstEvents){
    for(var s in srcEvents){
      if(dstEvents[d] && srcEvents[s] && dstEvents[d].id == srcEvents[s].id){
        // Delete event from arrays and update.
        srcEvents[s].summary = srcEvents[s].summary||'' + " [sync:"+source+"]";
        updateEvent_(srcEvents[s],dstCalId);
        srcEvents.splice(s,1);
        dstEvents.splice(d,1);
        Utilities.sleep(RATE_LIMIT);
      }
    }
  };

  // DELETE dest events
  for(var d in dstEvents){
    deleteEvent_(dstEvents[d],dstCalId);
    Utilities.sleep(RATE_LIMIT);
  };
  
  // INSERT src events.
  for(var s in srcEvents){
    srcEvents[s].summary = srcEvents[s].summary||'' + " [sync:"+source+"]";
    insertEvent_(srcEvents[s],dstCalId);
    Utilities.sleep(RATE_LIMIT);
  }
};


function updateEvent_(evt,calId){
  Calendar.Events.update( evt, calId, evt.id );
};


function deleteEvent_(evt,calId){
  Calendar.Events.remove(calId, evt.id);
};


function insertEvent_(evt,calId){
  try{
    Calendar.Events.insert(evt, calId);
  } catch(e) {
    var err = e.message;
    var newEvt = {
      summary:evt.summary,
      start:evt.start,
      end:evt.end,
      attachments:evt.attachments,
      attendees:evt.attendees,
      reminders:evt.reminders
    };
    
    if(err.search(/identifier already exists/g) >= 0){
      updateEvent_(evt,calId);
    } else if(err.search(/Not Found/g) >= 0){
      insertEvent_(newEvt,calId);
    } else if(err.search(/Invalid resource/g) >= 0){
      insertEvent_(newEvt,calId);
    } else {
      Logger.log("%s [%s]\n",evt,err);
    };
  }
};
//Task: Create PDFs

function createPdfs(){
  
  // 0 based column numbers
  const NAME = 0;
  const TITLE = 1;
  const COMPANY = 2;
  const ADDRESS = 3;
  const CITY = 4;
  const ZIP_PIN = 5;
  
  
  /* Get data from sheet */
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  /* Alternatively you can get data 
  from an external CSV file or anything else.
  var blob = DriveApp.getFileById(id).getBlob();
  var text = blob.getDataAsString();
  var data = JSON.parse(text);
  */

  data.shift(); // Remove headers
  
  var folderName = "Letters";
  var folder, folders = DriveApp.getFoldersByName(folderName);
  
  // 'folders' is an iterator
  if (folders.hasNext()){
    // Get first folder if more than 1 with same name.
    folder = folders.next();
  } else {
    // Create folder if not exist.
    folder = DriveApp.createFolder(folderName);
  }
  
  for(var i in data){
    // Set as global variables so that we will be 
    //able to access in Template.html code.
    name = data[i][NAME];
    title = data[i][TITLE];
    company = data[i][COMPANY];
    address = data[i][ADDRESS];
    city = data[i][CITY];
    zip_pin = data[i][ZIP_PIN];

    var html = 
    HtmlService.createTemplateFromFile 
    ("Template.html").evaluate();
    
    // Convert HTML to PDF
    var pdf = html.getAs("application/pdf").setName( name + 
    ".pdf");

    // Save in 'My Drive > Letter' folder.
    folder.createFile(pdf);
  }
  
}


// Task 4.6
function moveDriveFiles(){
  var SheetSettings = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");

  // Open root folder.
  var rootFolderName = "[[ Root folder name ]]";
  var rootFolder, destFolder, folders = DriveApp.getFoldersByName(rootFolderName);
  if (folders.hasNext()) rootFolder = folders.next();
  else {
    // Show warning "Folder not exist."
    Browser.msgBox("The root folder " + rootFolderName + " not exist.");
    return;
  }

  var data = SheetSettings.getDataRange().getValues();
  data.shift();// remove header

  for(var i in data){
    var fileName = data[i][0];
    var folderName = data[i][1];
    
    // Open or Create destination folder
    folders = rootFolder.getFoldersByName(folderName);
    if (folders.hasNext()) destFolder = folders.next();
    else destFolder = rootFolder.createFolder(folderName);

    // Move matching files to destination folder
    var dest, file, files = rootFolder.searchFiles('title contains "' + fileName + '"');
    while (files.hasNext()){
      dest = destFolder;
      file = files.next();
      file.makeCopy(file, dest);
      rootFolder.removeFile(file);
    }
  }
}

// Task 4.7
/* Code.gs file */
function onOpen(e){
  SpreadsheetApp.getUi().createAddonMenu()
  .addItem("File Search", "showSidebar")
  .addToUi();
  showSidebar();
}

function onInstall(e){
  onOpen(e);
}

/**
 * Opens sidebar in the document containing the add-on's user interface.
 *
 */
function showSidebar() {
  SpreadsheetApp.getUi().showSidebar(
    HtmlService.createHtmlOutputFromFile('Sidebar').setTitle('Search Files in Drive')
  );
}

/**
 *  Lists files matching with arg 'txt' in Settings tab. 
 *  
 */
function listDriveFiles(txt){
  var header = ["File", "URL"];
  var output = [header];
  
  var file, files = DriveApp.searchFiles('title contains "' + txt + '"');
  
  while (files.hasNext()){
    file = files.next();
    var name = file.getName();
    var link = file.getUrl();
    output.push([name,link]);
  };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Files");
  sheet.clearContents();
  sheet.getRange(1, 1, output.length, header.length).setValues(output);
}

/* Sidebar.html */
<!DOCTYPE html>
<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

<html>
  <head>
    <base target="_top">
  </head>
  <body>
    <input type="text" id="txt" />
    <button class="green" id="btn">Search</button>
  </body>
  
  <script>
  /**
   * On document load, assign click handlers to search button
   *
   */
  $(function() {
    $('#btn').click(listFiles);
  });
  
  function listFiles() {
    this.disabled = true;
    $('#error,#success').remove();
    google.script.run
      .withSuccessHandler(function(msg,elm){
         elm.disabled = false;
       })
      .withFailureHandler(function(err,elm){
         elm.disabled = false;
         showError(err,elm);
       })
      .withUserObject(this)
      .listDriveFiles($('#txt').val());
  }
  
  /**
  *
  *  @param msg {String} The message to display.
  */
  function showSuccess(msg,element) {
    var div = $('<div id="success"><font color="green">' + msg + '</font></div>');
    $(element).after(div);
  }

  /**
   * Inserts a div that contains an error message after a given element.
   *
   * @param msg The error message to display.
   * @param element The element after which to display the error.
   */
  function showError(msg, element) {
    var div = $('<div id="error" class="error">' + msg + '</div>');
    $(element).after(div);
  }

  </script>
</html>

