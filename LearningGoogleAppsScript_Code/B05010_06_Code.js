var url = "https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=PACKT";
try{
    var resp = UrlFetchApp.fetch(url);
    if(resp.getResponseCode() == 200){
      var text = resp.getContentText();
      var json = JSON.parse(text);
      Logger.log(json);
    }
  } catch(e){
    Logger.log(e);
  };


function searchGoogle(){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var SheetGoogle = ss.getSheetByName("Google");
  var kwd = SheetGoogle.getRange("B2").getValue();  
  
  // Encode URI components if any in kwd
  kwd = encodeURIComponent(kwd);
  
  // Replace space with '+'
  kwd = kwd.replace(/%20/gi, "+");
  
  // Remove '?' marks
  kwd = kwd.replace(/%3F/gi, "");
  
  var url = 
  "https://ajax.googleapis.com/ajax/services/ 
  search/web?v=3.0&q=" + kwd;

  try{
    var resp = UrlFetchApp.fetch(url).getContentText();
    var json = JSON.parse(resp);
    var result = json.responseData.results;
  } catch(e){
    Logger.log(e);
  };
  
  // We require a 2-dimensional array to store data in sheet
  var output = [];
  var visibleUrl,title,url,content;
  
  for(var i=0; i<result.length; i++){
    visibleUrl = result[i].visibleUrl;
    title = result[i].title;
    url = result[i].url;
    content = result[i].content;

    output.push([visibleUrl,title,url,content]);
  };
  
  /*
   * output.length for number of rows and output[0].length for
   * number of columns
   *
   */
  SheetGoogle.getRange(5, 1, output.length, output[0].length)
    .setValues(output);
}


function getStockQuotes(){
  var SheetQuotes = SpreadsheetApp.getActiveSpreadsheet()
                    .getSheetByName("Quotes");

  var data = SheetQuotes.getDataRange().getValues();
  
  // Remove header from data.
  var header = data.shift();
  
  // Extracts all symbols from sheet data.
  var aScrips = [];
  for(var i in data) aScrips.push(data[i][0]);

  // Join all scrip names with comma.
  var sScrips = aScrips.join(",");
  
  // Fetch data with scrip names as query.
  var url = 
  "http://finance.google.com/finance/info?q=NASDAQ:"+sScrips;
  
  // Send request to the url
  try{
    var resp = UrlFetchApp.fetch(url).getContentText().substr(4);
    var json = JSON.parse(resp);
  } catch (e) {
    Logger.log(e.message);
    return;
  }
  
  // We require 2-dim array to store data in sheet.
  var output = [];
  
  // Traverse through all json objects.
  for(var i in json){
    var q = json[i];

    // Symbol, price and traded time.
    output.push([q.t,q.l,q.ltt]);
  };

  // Restore header again.
  output.unshift(header);

  // Save output in sheet.
  SheetQuotes.getDataRange().setValues(output);
}


/**
 *  Log bitcoin price ticks in sheet
 *
 */
function getBitCoinData(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var SheetBitCoin = ss.getSheetByName("Bitcoin");
  
  // Header labels at top row of the sheet.
  var header = [
      "Timestamp",
      "High",
      "Low",
      "Volume",
      "Bid",
      "Ask"
    ];
  
  // Insert headers at top row of Bitcoin sheet.
  SheetBitCoin.getRange(1,1,1,6).setValues([header]);
  // setValues accept 2-dim array
  
  // BitStamp api url
  var url = "https://www.bitstamp.net/api/ticker/";
  
  try{
    var resp = UrlFetchApp.fetch(url);
    
    // Proceed if no errors returned.
    if(resp.getResponseCode() == 200){
      
      var json = JSON.parse(resp);
      
      var output = [];
      
      /*
       * Bitstamp returns timestamp in seconds
       * (elapsed since epoch), but javascript Date accepts in
       * millisecons, so multiply by 1000.
       *
       */
      output.push( new Date(json.timestamp *= 1000) );
      
      // last 24 hours high.
      output.push(json.high);
      
      // last 24 hours low.
      output.push(json.low);
      
      // last 24 hours volume.
      output.push(json.volume);
      
      // highest buy order.
      output.push(json.bid);
      
      // lowest sell order.
      output.push(json.ask);
      
      // Append output to Bitcoin sheet.
      SheetBitCoin.appendRow(output);
    }
    
  } catch(e){
    // Log errors to examine and debug later.
    Logger.log(e);
    
    throw e;
  }
};


function readRssFeedContents(){
  var SheetData = SpreadsheetApp.getActiveSpreadsheet()
                    .getSheets()[0];
  
  var title, posturl, author, row, output = [];

  // Prefix namespace.
  var dc = 
  XmlService.getNamespace('http://purl.org/dc/elements/1.1/');

  // Fetch feed document.
  var xml = UrlFetchApp.fetch("http://siliconangle.com/feed/")
            .getContentText();

  // Parse the response text from the url.
  var doc = XmlService.parse(xml);
  
  // Get child elements from the root element.
  var items = doc.getRootElement().getChild('channel')
              .getChildren('item');

  // Process the required data.
  for(var i=0; i<items.length; i++){
    title = items[i].getChild('title').getText();
    posturl = items[i].getChild('link').getText();
    author = items[i].getChild('creator', dc).getText();
    row = [title].concat(posturl, author);

    output.push(row);
  };

  // Write new data to sheet
  SheetData.getRange(2, 1, output.length, output[0].length)
    .setValues(output);
}


function readAtomFeedContents(){
  // SheetData refers left most sheet.
  var SheetData = SpreadsheetApp.getActiveSpreadsheet()
                  .getSheets()[0];

  // Set column titles.
  var title, description;

  // output is a 2-dim array, you need not replace anything.
  var output = [["Trends", "Related Searches"]];
  
  var url = "http://www.google.com/trends/hottrends/atom/feed";

  // Fetch data from the feed url.
  var xml = UrlFetchApp.fetch(url).getContentText();
  
  // Parse the result as xml content.
  var doc = XmlService.parse(xml);
  
  // Get item elements from the root element.
  var items = doc.getRootElement().getChild('channel')
              .getChildren('item');

  // Clear existing sheet data and set new values.
  SheetData.clearContents();

  // Store new data.
  SheetData.getRange(1, 1, 1, output[0].length).setValues(output);

  /*
   * Dig into 'item' element and parse all required data.
   * Get other related search terms.
   *
   */
  for(var i=0; i<items.length; i++){
    title = items[i].getChild('title').getText();
    description = items[i].getChild('description').getText();
    output = [title].concat(description.split(','));
    
    // Sets output data in sheet.
    SheetData.getRange(i+2, 1, 1, output.length)
      .setValues([output]);
  }
};



// LANGUAGE TRANSLATOR
/*
 * Replace with the id/key of the target document in which the
 * translated text to be saved.
 *
 */
var targetDocumentId = "Replace with target document id";

/**
 * Creates a menu entry in the Google Docs UI when the document
 * is opened.
 *
 */
function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

/**
 * Opens a sidebar in the document containing the add-on's user
 * interface.
 *
 */
function showSidebar() {
  var ui = HtmlService.createTemplateFromFile('Sidebar')
           .evaluate()
           .setTitle('Translate');

  DocumentApp.getUi().showSidebar(ui);
}

/**
 * Gets the stored user preferences for the destination language,
 * if exist.
 *
 */
function getPreferences() {
  var userProperties = PropertiesService.getUserProperties();

  var languagePrefs = {
    destLang: userProperties.getProperty('destLang')
  };

  return languagePrefs;
};


function runTranslation(dest, savePrefs) {
  if (savePrefs == true) {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('originLang', 'en');
    userProperties.setProperty('destLang', dest);
  }

  var srcFile = DocumentApp.getActiveDocument();
  var tgtFile = DocumentApp.openById(targetDocumentId);

  var srcBody = srcFile.getBody();
  var tgtBody = tgtFile.getBody();

  tgtBody.appendParagraph("");
  tgtBody.clear();
  
  var item = srcBody.getChild(0);

  while(item){
    var type = item.getType();

    if(type == "LIST_ITEM"){
      var attrib = item.getAttributes();
      var level = item.getNestingLevel();
      var srcText = item.getText();
      var transText = LanguageApp.translate(srcText, "en", dest);

      tgtBody.appendListItem(transText).setAttributes(attrib)
      .setNestingLevel(level);
    };

    item = item.getNextSibling();
  };

  tgtBody.getChild(0).removeFromParent();
};


function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}


<!-- Sidebar.html -->
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <script src="//polymerstaticfiles.appspot.com/bower_components 
    /webcomponentsjs/webcomponents.js"></script>

    <link rel="import" 
    href="//polymerstaticfiles.appspot.com/bower_components 
   /polymer/polymer.html">

    <link rel="import" 
    href="//polymerstaticfiles.appspot.com/ 
    bower_components/font-roboto/roboto.html">

    <link rel="import" 
    href="//polymerstaticfiles.appspot.com/ 
    bower_components/paper-input/paper-input.html">

    <link rel="import" 
    href="//polymerstaticfiles.appspot.com/ 
    bower_components/paper-button/paper-button.html">

    <link rel="import" 
    href="//polymerstaticfiles.appspot.com/ 
    bower_components/paper-checkbox/paper-checkbox.html">

    <link rel="import" 
    href="//polymerstaticfiles.appspot.com/ 
    bower_components/paper-radio-group/paper-radio-group.html">

    <link rel="import" 
    href="//polymerstaticfiles.appspot.com/ 
    bower_components/paper-radio-button/paper-radio-button.html">

    <link rel="import" 
    href="//polymerstaticfiles.appspot.com/ 
    bower_components/paper-input/paper-input-decorator.html">

    <!-- Insert CCS code -->
    <?!= include('Sidebar.css.html'); ?>
  </head>

  <body>
    <div class="sidebar">
      <h4>Translate into</h4>
      <paper-radio-group id="dest">
        <paper-radio-button name="en" id="radio-dest-en" 
        label="English"></paper-radio-button>

        <paper-radio-button name="fr" id="radio-dest-fr" 
        label="French"></paper-radio-button>

        <paper-radio-button name="de" id="radio-dest-de" 
        label="German"></paper-radio-button>

        <paper-radio-button name="ja" id="radio-dest-ja" 
        label="Japanese"></paper-radio-button>

        <paper-radio-button name="es" id="radio-dest-es" 
        label="Spanish"></paper-radio-button>
      </paper-radio-group>

      <br /><br />
      <hr />

      <paper-checkbox id="save-prefs" label="Use this 
       language by default"></paper-checkbox>

      <div id="button-bar">
        <paper-button raised class="colored" id="run- 
        translation">Translate</paper-button>
      </div>
    </div>

    <!--  Insert JS code -->
    <?!= include('Sidebar.js.html'); ?>
  </body>
</html>

<!--  Sidebar.css.html -->
  <style>
    body {
      font-family: 'RobotoDraft', sans-serif;
      margin: 0;
      padding: 0;
    }

    h4 {
      text-align: center;
      margin: 0;
    }

    paper-button {
      margin: 0;
      margin-top: 10px;
    }

    .sidebar {
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      overflow-y: auto;
      padding: 12px;
      position: absolute;
      width: 100%;
    }

    #dest {
      margin-top: 5px;
    }

    .error {
      color: #dd4b39;
      font-size: small;
      margin-top: 8px;
    }

    .colored {
      background: #4285f4;
      color: #ffffff;
    }
  </style>

  
<-- Sidebar.js.html -->

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

  <script>
    /**
     * On document load, assign click handlers to each button and
     * try to load the user's origin and destination language
     * preferences, if previously set.
     *
     */
    $(function() {
      $('#run-translation').click(runTranslation);

      google.script.run
        .withSuccessHandler(loadPreferences)
        .withFailureHandler(showError).getPreferences();
    });


    /**
     * Callback function that populates the origin and destination
     * selection boxes with user preferences from the server.
     *
     */
    function loadPreferences(languagePrefs) {
      if (languagePrefs.destLang){ 
        $('#dest').prop('selected', languagePrefs.destLang);
      }
    }


    /**
     * Runs a server-side function to translate the user-selected
     * text and update the sidebar UI with the resulting 
     * translation.
     *
     */
    function runTranslation() {
      this.disabled = true;
      $('#error').remove();

      var dest = $('#dest').prop('selected');
      var savePrefs = $('#save-prefs').prop('checked');

      google.script.run
        .withSuccessHandler(
          function(msg, element) {
            element.disabled = false;
          })
        .withFailureHandler(
          function(msg, element) {
            showError(msg, $('#button-bar'));
            element.disabled = false;
          })
        .withUserObject(this)
        .runTranslation(dest, savePrefs);
    }


    /**
     * Inserts a div that contains an error message after a given
     * element.
     *
     */
    function showError(msg, element) {
      var div = $('<div id="error" class="error">' + msg + 
      '</div>');

      $(element).after(div);
    }
  </script>


//===================================================  
// Document reviewing and commenting application
//===================================================  

// Code.gs file

function onOpen() {
  var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Review and Comment');

  DocumentApp.getUi().showSidebar(ui);
}


function insertComment(comment, selectedText){
  // You should enable this advanced service (Drive API).
  Drive.Comments.insert(
    {
      "content": comment,
      "context": {"type":"text/html", "value":selectedText},
    },
    DocumentApp.getActiveDocument().getId()
  );
}

/**
 * Replaces the text of the current selection with the provided
 * text, or inserts text at the current cursor location.
 * (There will always be either a selection or a cursor.)
 * If multiple elements are selected, only inserts the text in the
 * first element that can contain text.
 *
 * @param {string} newText The text with which to replace the
 *                 current selection.
 *
 */
function insertText(newText) {
  var selection = DocumentApp.getActiveDocument().getSelection();

  // If any text selected then get selected text else cursor.
  if (selection) {
    var elements = selection.getRangeElements();
    for (var i = 0; i < elements.length; i++) {
      var startIndex = elements[i].getStartOffset();
      var endIndex = elements[i].getEndOffsetInclusive();
      
      // If picture/image element selected.
      if(startIndex == endIndex) throw "Error: Select text only.";
      
      // Highlight the selected text.
      var element = elements[i].getElement()
         .setBackgroundColor(startIndex, endIndex, '#f6d2ab');
      
      // Insert selected comment next to the selected text.
      element.insertText(endIndex+1, '[' + newText +']')
         .setBackgroundColor(
            endIndex+1, endIndex+newText.length+2, '#bbffbb'
          );
      
      var text = element.getText()
         .substring(
            startIndex,endIndex+1
          );

      // Call insertComment function      
      insertComment(newText,text);
    }

  } else {

    var curr = DocumentApp.getActiveDocument().getCursor();

    // Exit if document not active or cursor not in document.
    if(!curr) return;
    
    // Insert comment and call insertComment function.
    curr.insertText('[' + newText +']')
      .setBackgroundColor('#bbffbb');
    
    insertComment(newText);
  }
}

function insertScore(newText){
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  body.appendHorizontalRule();
  body.appendParagraph(newText)
    .setAttributes({FONT_SIZE:24,FOREGROUND_COLOR:'#6aa84f'});
}



<!-- Sidebar.html -->
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    
    <!-- Google add-on stylesheet -->
    <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css" />
    
    <!-- JQuery UI stylesheet -->
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css" />
    
    <!-- JQuery base library -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    
    <!-- JQuery UI library -->
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"></script>
    
    <!-- Add additional styles -->
    <style>
      select{ height:35px; }

      textarea{
        width:100%;
        margin-top: 3px;
        margin-bottom: 3px;
      }

      .blue{
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        border-radius: 3px;
      }

      .blue + .blue{
        margin: .5px -.5px;
      }

      .ui-accordion .ui-accordion-header {
        display: block;
        cursor: pointer;
        position: relative;
        margin-top: 1px;
        padding: .4em .25em .4em .25em;
        min-height: 0; /* support: IE7 */
      }

      .ui-accordion .ui-accordion-icons {
        padding-left: 2em;
      }

      .ui-accordion .ui-accordion-content {
        padding: .5em .5em;
        overflow: auto;
      }
    </style>
  </head>

  <body>
    <!-- To comply with jQuery UI library,
        The accordion should be in the form:
      <div id="accordion">
        <h3>Section 1</h3>
        <div>
          ...
        </div>

        <h3>Section 2</h3>
        <div>
          ...
        </div>
      </div>
    -->
  
    <div id="accordion">

      <h3>Comments</h3>
      <div>
        <b>Highlight text and click the appropriate comment</b>
        <div id="button-bar">
          <button class="blue comment-button" value = "Awkward">Awkward</button>

          <button class="blue comment-button" value = "Citation Needed">Citation Needed</button>

          <button class="blue comment-button" value="Improper Citation">Improper Citation</button>

          <button class="blue comment-button" value="Commonly Confused">Commonly Confused</button>

          <button class="blue comment-button" value="Delete">Delete</button>

          <button class="blue comment-button" value="Run-on">Run-on</button>

          <button class="blue comment-button" value="Vague">Vague</button>
        </div>

        <div>
          <textarea rows="3" id="insert-text"
            placeholder="Type your comment here"></textarea>
        </div>

        <div>
          <button class="blue" id="insert-button">Comment</button>
        </div>
      </div>

      <h3>Scores</h3>
      <div>
        <div id="score-bar">
          Does the document meets the expectation?
          <br />
          <button class="green insert-score" value="Meets">Yes</button>

          <button class="green insert-score" value="Not Yet">No</button>
        </div>
      </div>
    </div>
    
    <script>
      // On document load assign the events.
      $(function(){
      
        /**
         * Which accordion block should be active/expanded by
         * default, here the first one.
         *
         */
        $("#accordion").accordion({ active: 0 });
        
        // Assign click event to buttons.
        $(".comment-button").click(insertButtonComment);
        $("#insert-button").click(insertCustomComment);
        $(".insert-score").click(insertScore);
        
      });
      
      
      /**
       *  Runs a server-side function to insert pre-defined
       *  comment into the document at the user's cursor or
       *  selection.
       *
       */
      function insertButtonComment() {
        this.disabled = true;
        $('#error').remove();
        
        google.script.run
          .withSuccessHandler(
            function(returnSuccess, element) {
              element.disabled = false;
            }
           )
          .withFailureHandler(
             function(msg, element) {
               showError(msg, $('#button-bar'));
               element.disabled = false;
             }
           )
          .withUserObject(this)
          .insertText($(this).val());
      }

      /**
       *  Runs a server-side function to insert custom comment
       *  into the document at the user's cursor or selection.
       *
       */
      function insertCustomComment() {
        this.disabled = true;
        $('#error').remove();
        
        google.script.run
          .withSuccessHandler(
             function(returnSuccess, element) {
               element.disabled = false;
             }
           )
          .withFailureHandler(
             function(msg, element) {
               showError(msg, $('#button-bar'));
               element.disabled = false;
             }
           )
          .withUserObject(this)
          .insertText($('#insert-text').val());
      }


      /**
       *  Runs a server-side function to insert the score
       *
       */
      function insertScore() {
      this.disabled = true;
      $('#error').remove();
      
      google.script.run
        .withSuccessHandler(
           function(returnSuccess, element) {
             element.disabled = false;
           }
         )
        .withFailureHandler(
           function(msg, element) {
             showError(msg, $('#score-bar'));
             element.disabled = false;
           }
         )
        .withUserObject(this)
        .insertScore($(this).val());
      }
        
      /**
       *  Inserts a div that contains an error message after a
       *  given element.
       *
       *  @param msg The error message to display.
       *  @param element The element after which to display the
       *                 error.
       *
       */
      function showError(msg, element) {
        var div = $('<div id="error" class="error">'
            + msg + '</div>');

        $(element).after(div);
      }
    </script>
  </body>
</html>



