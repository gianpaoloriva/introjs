function createForm() {
  
  var ThisSpreadsheet = SpreadsheetApp.getActive();
  var SheetPlaces = ThisSpreadsheet.getSheetByName("Places");
  
  var data = SheetPlaces.getDataRange().getValues();
  data.shift(); // remove header row
  
  var places = [];
  
  data.forEach(function(row){
    places.push(row[0]);
  });
  
  var form = FormApp.create("Vacation Form");
  
  form.addMultipleChoiceItem()
  .setTitle('Where will you go for vacation?')
  .setChoiceValues(places)
  .showOtherOption(true);
  
}

<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
  </head>
  <body>
    <form>
      <h4>Where will you go for vacation?</h4>
      <input type="radio" name="places" value="Place 1" />Place 1<br />
      <input type="radio" name="places" value="Place 2" />Place 2<br />
      <input type="radio" name="places" value="Place 3" />Place 3<br />
      <input type="radio" name="places" value="Place 4" />Place 4<br />
      <br />
      <input type="submit" value="SUBMIT" />
    </form>
  </body>
</html>


function doGet() {
  // Replace with your spreadsheet id.
  var ss = SpreadsheetApp.openById("1eDAGT20m9voWFhn7ueFe09BYkwO5-86S53de08C0mmM");
  var SheetPlaces = ss.getSheetByName("Places");
  
  var data = SheetPlaces.getDataRange().getValues();
  data.shift();
  
  var places = [];
  data.forEach(function(row){
    places.push(row[0]);
  });
  
  var template = HtmlService.createTemplateFromFile("Form.html");
  template.places = places;

  var html = template.evaluate();
  return HtmlService.createHtmlOutput(html);
}


function doPost(e){
  // Replace with your spreadsheet id.
  var ss = SpreadsheetApp.openById("1eDAGT20m9voWFhn7ueFe09BYkwO5-86S53de08C0mmM");
  var SheetResponses = ss.getSheetByName("Responses");
  
  // Create 'Responses' sheet if not exist.
  if(!SheetResponses) SheetResponses = ss.insertSheet("Responses");
  
  SheetResponses.appendRow([e.parameter.places]);
  
  return ContentService.createTextOutput("Your response submitted successfully. Thank you!");
}

function postFormDataToSheet(e){
  // Logger.log(e);
  var ss = SpreadsheetApp.openById("1eDAGT20m9voWFhn7ueFe09BYkwO5-86S53de08C0mmM");

  var SheetResponses = ss.getSheetByName("Responses");

  // Create 'Responses' sheet if not exist.
  if(!SheetResponses) SheetResponses = ss.insertSheet("Responses");

  SheetResponses.appendRow([e.places]);
}


<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    
    <script>
      function postData(form){
        google.script.run
          .withSuccessHandler(showSuccess)
          .withFailureHandler(showError)
          .withUserObject(form)
          .postFormDataToSheet(form);
      }
      
      // msg - the error or success message returned from server.
      // elem - the reference to the user object (form).
      function showSuccess(msg,elem) {
        var newElement = document.createElement("div");
        newElement.innerHTML = '<font color="green">' + msg + '</font>';
        elem.appendChild(newElement);
      }
      
      // msg - the error or success message returned from server.
      // elem - the reference to the user object (form).
      function showError(msg,elem){
        var newElement = document.createElement("div");
        newElement.innerHTML = '<font color="red">' + msg + '</font>';
        elem.appendChild(newElement);
      }

    </script>
  </head>
  
  <body>
    <form>
      <h4>Where will you go for vacation?</h4>
      
      <? for (var i in places) { ?>
        <input type="radio" name="places" value="<?= places[i] ?>" /><?= places[i] ?><br />
      <? } ?>
      
      <br />
      <input type="button" value="SUBMIT" onclick="postData(this.parentNode);" />
    </form>
  </body>
</html>


function postFormDataToSheet(e){
  // Replace with your spreadsheet id.
  var ss = SpreadsheetApp.openById("1eDAGT20m9voWFhn7ueFe09BYkwO5-86S53de08C0mmM");
  var SheetResponses = ss.getSheetByName("Responses");
  
  // Create 'Responses' sheet if not exist.
  if(!SheetResponses) SheetResponses = ss.insertSheet("Responses");
  
  SheetResponses.appendRow([e.places]);
  
  return "Your response submitted successfully. Thank you!";
}


<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    
    <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css" />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    
    <script>
      $(function(){
        $("#submit").click(postData);
      });
      
      function postData(){
        google.script.run
          .withSuccessHandler(showSuccess)
          .withFailureHandler(showError)
          .withUserObject(this)
          .postFormDataToSheet(this.parentNode);
      }
      
      // msg - message returned from server.
      // elem - reference to the user object.
      function showSuccess(msg,elem) {
        var div = $('<div id="error"><font color="green">' + msg + '</font></div>');
        $(elem).after(div);
      }
      
      // msg - error message returned from server.
      // elem - reference to the user object.
      function showError(msg, elem) {
        var div = $('<div id="error" class="error">' + msg + '</div>');
        $(elem).after(div);
      }
    </script>
  </head>
  
  <body>
    <form>
      <h4>Where will you go for vacation?</h4>
      
      <? for (var i in places) { ?>
        <input type="radio" name="places" value="<?= places[i] ?>" /><?= places[i] ?><br />
      <? } ?>
      
      <br />
      <input class="submit" id="submit" type="button" value="SUBMIT" onclick="postData(this.parentNode);" />
    </form>
  </body>
</html>

// Evoting application
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    
    <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css" />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    
    <script>
      $(function(){
        $("#submit").click(postData);
      });
      
      function postData(){
        // Remove previous messages if any
        $("#error,#success").remove();

        // Disable submit button until server returns anything.
        this.disabled = true;

        // Call server function
        google.script.run
          .withSuccessHandler(showSuccess)
          .withFailureHandler(showError)
          .withUserObject(this)
          .postFormDataToSheet(this.parentNode);
      }
      
      // msg - success message returned from server.
      // elem - reference to the user object.
      function showSuccess(msg,elem) {
        elem.disabled = false;
        var div = $('<div id="success"><font color="green">' + msg + '</font></div>');
        $(elem).after(div);
      }
      
      // msg - error message returned from server.
      // elem - reference to the user object.
      function showError(msg, elem) {
        elem.disabled = false;
        var div = $('<div id="error" class="error">' + msg + '</div>');
        $(elem).after(div);
      }
    </script>
  </head>
  
  <body>
    <form>
      <h4>Where will you go for vacation?</h4>
      
      <? for (var i in places) { ?>
        <input type="radio" name="places" value="<?= i ?>" /><?= places[i] ?><br />
      <? } ?>
      
      <br />
      <input class="blue" id="submit" type="button" value="SUBMIT" onclick="postData(this.parentNode);" />
    </form>
  </body>
</html>

function doGet() {
  // Replace with your spreadsheet id.
  var ss = SpreadsheetApp.openById("1tRymQszkatOkX3pxkdHRRkE6N2QJgvnfimw5apVSK90");
  var SheetPlaces = ss.getSheetByName("Places");
  
  var data = SheetPlaces.getDataRange().getValues();
  data.shift();
  
  var places = [];
  data.forEach(function(row){
    places.push(row[0]);
  });
  
  var template = HtmlService.createTemplateFromFile("Form.html");
  template.places = places;
  
  var html = template.evaluate();
  html.setTitle("eVoting");

  return HtmlService.createHtmlOutput(html);
}


function postFormDataToSheet(e){
  // Replace with your spreadsheet id.
  var ss = SpreadsheetApp.openById("1tRymQszkatOkX3pxkdHRRkE6N2QJgvnfimw5apVSK90");
  var SheetPlaces = ss.getSheetByName("Places");
  
  var data = SheetPlaces.getDataRange().getValues();
  
  var i = Number(e.places)+1;
  data[i][1]++;
  
  SheetPlaces.getRange(1, 1, data.length, data[0].length).setValues(data);
  
  return "Your response submitted successfully. Thank you!";
}


// Ticket Reservation Application
function doGet(e) {
  // Maximum available
  const MAX_TICKETS = 25;

  // ‘cancel’ is a query string appended with the published url.
  var cancel = e.parameter.cancel;

  if(cancel){
    var msg = cancelReservation(cancel);
    return ContentService.createTextOutput(msg);
  }
  
  // Replace with your spreadsheet id.
  var ss = SpreadsheetApp.openById("19L6Gxx0nFtIeJGLgZKcYaaxbbqysdCAZjXvvFNHw4RU");
  var SheetReservations = ss.getSheetByName("Reservations");
  
  var data = SheetReservations.getDataRange().getValues();
  data.shift();
  
  var template = HtmlService.createTemplateFromFile("Form.html");
  template.available = MAX_TICKETS - data.length;
  
  if(template.available < 1)
  return ContentService.createTextOutput("All tickets reserved, sorry!");
  
  template.pubUrl = "https://script.google.com/macros/s/AKfycbzIkrLEaMMRRYwOA_d_Tiy1TFtxUylaotB07HB4wZGW/dev";

  // Uncomment the below line for production use.
  //template.pubUrl = ScriptApp.getService().getUrl();
  
  var html = template.evaluate();
  return HtmlService.createHtmlOutput(html);
  
}

function doPost(e){
  // Replace with your spreadsheet id.
  var ss = SpreadsheetApp.openById("19L6Gxx0nFtIeJGLgZKcYaaxbbqysdCAZjXvvFNHw4RU");
  var SheetReservations = ss.getSheetByName("Reservations");
  
  // name, phone_number and email are form elements.
  var name = e.parameter.name;
  var phoneNumber = e.parameter.phone_number;
  var email = e.parameter.email;
  var ticketNumber = +new Date(); // current date as epoch number

  SheetReservations.appendRow([name, phoneNumber, email, ticketNumber, "Reserved"]);
  
  // Send confirmation email with cancel link
  var pubUrl = "https://script.google.com/macros/s/AKfycbzIkrLEaMMRRYwOA_d_Tiy1TFtxUylaotB07HB4wZGW/dev";

  // Uncomment the below line for production use.
  //pubUrl = ScriptApp.getService().getUrl();
  
  var emailBody = '<p>Thank you for registering. Your ticket number: ' + ticketNumber + '</p>';

  emailBody += '<p>You can <a href="'+ pubUrl +'?cancel=' + ticketNumber + '">click here</a> to cancel reservation.</p>';
  
  MailApp.sendEmail({
    to: email,
    subject: "Reservation Confirmation",
    htmlBody: emailBody
  });

  return ContentService.createTextOutput("Your ticket reserved and confirmation email has been sent.\nThank you!");
}

function cancelReservation(timestamp){
  
  // Replace with your spreadsheet id.
  var ss = SpreadsheetApp.openById("19L6Gxx0nFtIeJGLgZKcYaaxbbqysdCAZjXvvFNHw4RU");
  var SheetReservations = ss.getSheetByName("Reservations");
  
  var data = SheetReservations.getDataRange().getValues();
  
  // Identify sheet row by timestamp if match then mark as cancelled.
  for(var i = 0; i < data.length; i++){
    if(data[i][3] == timestamp) data[i][4] = "Cancelled";
  }
  
  // Replace the updated data in sheet
  SheetReservations.getRange(1, 1, data.length, data[0].length).setValues(data);
  
  return "Your reservation cancelled.";
}

<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css" />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  </head>
  
  <body>
    <form method="post" action="<?= pubUrl ?>" >
    
      <h4>Reservation Form</h4>
      <p>Available: <?= available ?></p>
      <input type="text" name="name" placeholder="Enter your name"/><br />
      <input type="text" name="phone_number" placeholder="Enter phone number"/><br />
      <input type="text" name="email" placeholder="Enter email id"/><br />
        
      <br />
      <input class="blue" id="submit" type="submit" value="Reserve"/>
      
    </form>
  </body>
</html>
