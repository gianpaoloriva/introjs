//Task:4.1
function doGet(){
  var str = "Hello world!";
  return ContentService.createTextOutput(str);
}

//Task:4.2
//In the Code.gs file create the ‘doGet’ function as shown below.
function doGet() {
  
  // This spreadsheet may not be active
  //  while this function executes, so you cannot get access
  //  to active spreadsheet, use open by id.
  var ss = SpreadsheetApp.openById(“[[ this spreadsheet id ]]”);

  var SheetData = ss.getSheetByName("Data");
  
  var data = SheetData.getDataRange().getValues();
  
  var html = '<!DOCTYPE html><html><body><table border=1>';
  
  // Each row data passed as arg to the anonymous function.
  data.forEach(function(row){
    html += '<tr>';
    html += '<td>' + row[0] + '</td>';
    html += '<td>' + row[1] + '</td>';
    html += '<td>' + row[2] + '</td>';
    html += '</tr>';
  });
  
  // Close table, body and html tags.
  html += '</table></body></html>';
  
  // Return as RSS xml document.
  return HtmlService.createHtmlOutput(html);
  
}

//Task:4.3
//Create the ‘doGet’ function as shown below.
function doGet(){
  /**
   *  This spreadsheet may not be active
   *  while this function executes, so you cannot get access
   *  to active spreadsheet, use open by id.
   *
   */
  var ss = SpreadsheetApp.openById(“[[ this spreadsheet id ]]”);

  var SheetData = ss.getSheetByName("Data");
  
  var data = SheetData.getDataRange().getValues();
  data.shift(); // Remove header
  
  var date = new Date();
  var currYear = date.getFullYear();
  
  var output = {};
  
  data.forEach(function(row){
    var dob = new Date(row[3]);
    var dobYear = dob.getFullYear();
    
    output[row[2]] = {};
    output[row[2]].dob = Utilities.formatDate(row[3], "UTC", "MM/dd/yyyy");
    output[row[2]].age = currYear - dobYear;
  });
  
  var json = JSON.stringify(output);
  return ContentService.createTextOutput(json);
}


//Task:4.4
//In the Code.gs file create ‘doGet’ function as listed below.
function doGet() {
  var ss = SpreadsheetApp.openById(“[[ this spreadsheet id ]]”);
  var SheetData = ss.getSheetByName("Data");
  
  var template = HtmlService.createTemplateFromFile("Template.html");
  // Assign ‘data’ to the template object
  template.data = SheetData.getDataRange().getValues();
  
  // Evaluate template object as html content
  var html = template.evaluate();

  // Convert html content to pdf
  //var pdf = html.getAs("application/pdf").setName("Test_Data.pdf");
  var pdf = html.getAs(MimeType.PDF).setName("Test_Data.pdf");
  
  // Creat pdf file in “My Drive” folder and share with public
  var file = DriveApp.createFile(pdf);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  
  // Create and return html content with link to the pdf file.
  return HtmlService.createHtmlOutput('Click <a target="_top" href="'+ file.getUrl() +'">here</a> to view pdf file.');
}

//Create a new html file, rename it as ‘Template.html’ and enter the html code shown below.
<!DOCTYPE html>
<html>
  <body>
    <table>
      <? for(var i in data) {?>
        <tr>
          <? for(var j in data[i]) { ?>
            <td><?= data[i][j] ?></td>
          <? } ?>
        </tr>
      <? } ?>
    </table>
  </body>
</html>


//Task:4.5
//The doGet function listed below shows that how you can use the event object to get the required parameters for further processing.
function doGet(e){
  
  // Get the fname value from the query string.
  var firstName = e.parameter.fname;
  
  var ss = SpreadsheetApp.openById(“[[ this spreadsheet id ]]”);

  var SheetData = ss.getSheetByName("Data");
  
  var data = SheetData.getDataRange().getValues();
  data.shift(); // Remove header
  
  var date = new Date();
  var currYear = date.getFullYear();
  
  var output = {};
  
  data.forEach(function(row){
    
    if(firstName !== row[0]) return;
    
    var dob = new Date(row[3]);
    var dobYear = dob.getFullYear();
    
    output[row[2]] = {};
    output[row[2]].dob = Utilities.formatDate(row[3], "UTC", "MM/dd/yyyy");
    output[row[2]].age = currYear - dobYear;
  });
  
  var json = JSON.stringify(output);
  
  return ContentService.createTextOutput(json);
}



//Task:4.6
//Also edit/enter the ‘doGet’ function as listed below.
function doGet() {
  
  // There is no active spreadsheet, so you should open by id.
  // Use the id of the spreadsheet in which your script resides.
  var ss = SpreadsheetApp.openById([[ this spreadsheet id ]]);
  
  var SheetRss = ss.getSheetByName("RSS Data");

  var rssData = SheetRss.getDataRange().getValues();
  rssData.shift(); // Remove header.
  
  var strRss = '<?xml version="1.0" encoding="UTF-8"?>';
  // Root element.
  strRss += '<rss>';
  
  // Open channel element.
  strRss += '<channel>';
  
  // Add description and language elements.
  strRss += '<description>A brief description of the channel</description>';
  strRss += '<language>en-US</language>';
  
  // Each row data passed as argument to the anonymous function.
  rssData.forEach(function(row){
    strRss += '<item>';
    strRss += '<title>' + row[0] + '</title>';
    strRss += '<link>' + row[1] + '</link>';
    strRss += '<creator>' + row[2] + '</creator>';
    strRss += '</item>';
  });
  
  // Close channel and root(rss) elements.
  strRss += '</channel></rss>';
  
  // Return as RSS xml document.
  return ContentService.createTextOutput(strRss).setMimeType(ContentService.MimeType.RSS);
  
}


//Task:4.7
//In ‘Code.gs’ file:
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Form.html')
           .setTitle("File Upload")
           .setSandboxMode(HtmlService.SandboxMode.EMULATED);
}


function uploadFiles(e) {
  var folderName = "Uploaded Files";
  var folder, folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) folder = folders.next();
  else folder = DriveApp.createFolder(folderName);
  
  var file = folder.createFile(e.file);
  return file.getUrl();
  
}

The ‘uploadFiles’ function looks for existing folder with the name "Uploaded Files", if not found then creates the same within ‘My Drive’ folder. Subsequently, creates the file passed with the argument and returns the created file url. 
Update the code below in ‘Form.html’ file.
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css" />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  </head>

  <body>
    <div class="sidebar">
      <form>
        <input type="file" name="file"><br /><br />
        <input type="button" id="submit" class="submit" value="Upload">
      </form>
    </div>
    
    <script>
      $(function(){
        $("#submit").click(fileUpload);
      });
      
      function fileUpload(){
        this.disabled = true;
        google.script.run
          .withSuccessHandler(function(msg, element){
              element.disabled = false;
              alert("File uploaded successfully.\nThe file url is: "+msg);
            })
          .withFailureHandler(function(msg, element) {
              element.disabled = false;
              showError(msg, element);
           })
          .withUserObject(this)
          .uploadFiles(this.parentNode);
      }

      function showError(msg, element) {
        var div = $('<div id="error" class="error">' + msg + '</div>');
        $(element).after(div);
      }

    </script>
  </body>
</html>


//Task:4.8
//In the ‘Code.gs’ file create the global variables, ‘doGet’ and ‘getEmpNames’ functions. Replace "[[ this spreadsheet id ]]" with the actual id/key (as a string) of the spreadsheet in which you are editing the code.

var ssid = "[[ this spreadsheet id ]]";

var DF = "MM/dd/yyyy HH:mm:ss";
var TZ = Session.getScriptTimeZone();

var ss = SpreadsheetApp.openById(ssid);
var TimeSheet = ss.getSheetByName("TimeSheet");
var EmpSheet = ss.getSheetByName("EmployeesList");
var BackupSheet = ss.getSheetByName("Backup");
var MessageSheet = ss.getSheetByName("Message");


function doGet(e){
  return HtmlService.createTemplateFromFile("Timesheet")
          .evaluate();
}


function getEmpNames(){
  var emp = [];
  var data = EmpSheet.getDataRange().getValues();

  for(var i in data) if(data[i][0]) emp.push(data[i][0]);
  return emp;
}


function postTime(name,val){
  var time = fmtDate_(new Date());
  var data = TimeSheet.getDataRange().getValues();

  // Shift start
  if(val == "sb"){
    for(var i in data){
      if(data[i][1] != name) continue;
      if(data[i][0] == "se") continue;
      throw "Please end your previous shift.";
    }

    for(var i in data){
      if(data[i][1] == name && data[i][0] == "sb" ){
        data[i][0] = val;
        data[i][2] = time;
        TimeSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
        return "Updated.";
      }
    }

    // insert new name and update start time.
    TimeSheet.appendRow([val,name,time]);
    return "Updated.";
  }

  // Break start
  if(val == "bb"){
    for(var i in data){
      if(data[i][0] == "sb" && data[i][1] == name ){
        data[i][0] = val;
        data[i][3] = time;
        TimeSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
        return "Updated.";
      }
    }
    throw "Please start your shift.";
  }

  // Break end
  if(val == "be"){
    for(var i in data){
      if(data[i][0] == "bb" && data[i][1] == name ){
        data[i][0] = val;
        data[i][4] = time;
        TimeSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
        return "Updated.";
      }
    };

    throw "Please start your break.";
  }

  // Shift end
  if(val == "se"){
    for(var i in data){
      if(data[i][1] == name && (data[i][0] == "sb" || data[i][0] == "be") ){
        data[i][5] = time;
        data[i].shift();
        BackupSheet.insertRowBefore(2);
        BackupSheet.getRange(2, 1, 1, data[i].length).setValues(data.splice(i,1));
        if(i<2) TimeSheet.appendRow(['']);
        TimeSheet.deleteRow(Number(i)+1);
        return "Updated.";
      }
    }
    if(data[i][0] == "bb")
      throw "Please end your break.";

    throw "Please start your shift.";
  }
}


function fmtDate_(d,format){
  var fmt = format || DF;
  return Utilities.formatDate(d, TZ, fmt);
}


function getMessage(){
 return MessageSheet.getRange("A2").getValue();
}

The ‘getMessage’ function gets and returns whatever text/html placed in cell A2 of ‘Message’ sheet.
Create new html file named as ‘Timesheet.html’ and enter the following codes in it.
<div id="loading" align="center"><p>Loading, please wait...</p></div>

<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>

<div class="sidebar">
  <fieldset>
    <legend>Timesheet</legend>
    <label for="employee">Select your name:</label>
    <select id="employee" name="employee" >
      <? var empName = getEmpNames();
        for(var i in empName){ ?>
          <option value="<?= empName[i] ?>" ><?= empName[i] ?></option>
      <? } ?>
    </select>
    <button id="sb" value="sb">Shift Start</button>
    <button id="bb" value="bb">Break Start</button>
    <button id="be" value="be">Break End</button>
    <button id="se" value="se">Shift End</button>
  </fieldset>
  <fieldset>
    <legend></legend>
    <div id="message"></div>
  </fieldset>
</div>

<script>
  $(function() {
    $("#loading").hide();
    $('#sb,#bb,#be,#se').click(postTime);
    $('#employee').change(getStatus);
    get_essage();
  });


  function get_essage(){
    google.script.run
    .withSuccessHandler(function(msg){
      $("#message").html(msg);
    })
    .getMessage();
  }

  
  function getStatus(){
    $('#error,#success').remove();
  }


  function postTime(){
    this.disabled = true;
    $('#error,#success').remove();
    google.script.run
    .withSuccessHandler(function(msg, elm){
      elm.disabled = false;
      showSuccess(msg, elm);
    })
    .withFailureHandler(function(msg, elm){
      elm.disabled = false;
      showError(msg, elm);
    })
    .withUserObject(this)
    .postTime($("#employee").val(),$(this).val());
  }

  
  function showSuccess(msg,elm) {
    var span = $('<span id="success"><font color="green">' + msg + '</font></span>');
    $(elm).after(span);
  }


  function showError(msg, elm) {
    var span = $('<span id="error" class="error">' + msg + '</span>');
    $(elm).after(span);
  }
</script>


