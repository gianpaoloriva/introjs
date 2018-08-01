// Task 3.1
function searchContacts(){

  var SheetContacts = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Contacts");

  // Read input from cell A3 
  var searchCriteria = SheetContacts.getRange("A3").getValue();

  //  First 10 contacts.
  //  [You can change this limit, but advised to keep small.]
  var numOfContacts = 10;

  // Clear existing sheet data
  SheetContacts.getRange(7,1,numOfContacts,4).clear();
  
    // Returns an array of contacts where
  // contacts name matches with search text.
  var contacts = ContactsApp.getContactsByName(searchCriteria);

  //  Limit number of contacts.
  if(contacts.length > numOfContacts) contacts.length = 
  numOfContacts;

  var cell = SheetContacts.getRange("A7");

  for(var i in contacts){
    var name = contacts[i].getFullName();
    var email = contacts[i].getEmails()[0];

    if(email) email = email.getAddress();
    else email = "";

    // For simplicity get the first phone number
    var phone = contacts[i].getPhones()[0];

    if (phone) phone = phone.getPhoneNumber();
    else phone = "";

    // For simplicity get the first address
    var address = contacts[i].getAddresses()[0];

    if(address) address = address.getAddress();
    else address = "";

    // cell.offset(rowOffset, columnOffset)
    cell.offset(i,0).setValue(name);
    cell.offset(i,1).setValue(email);
    cell.offset(i,2).setValue(phone);
    cell.offset(i,3).setValue(address);
  }
};

// Task 3.2

function updateContacts(){
  var SheetContacts = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Contacts");

  var cell = SheetContacts.getRange("A7");
  
  var numOfContacts = 10;
  
  for(var i = 0; i < numOfContacts; i++){
    
    var email = cell.offset(0, 1).getValue();

    // Skip if email field is null
    if(!email) continue;
    
    var contact = ContactsApp.getContact(email);

    // Skip if contact is null or undefined
    if(!contact) continue;
    
    
    var name = cell.offset(i, 0).getValue();

    // Skip if name field is null
    if(!name) continue;
    contact.setFullName(name);
    
    
    var phone = cell.offset(i, 2).getValue().toString();
    
    // Returns phone numbers as an array
    var contPhone = 
    contact.getPhones(ContactsApp.Field.MAIN_PHONE)[0];
    
    // Update main phone number if exist otherwise add.
    if(phone){

      if(contPhone){
        contPhone.setPhoneNumber(phone);
      } else {
        contact.addPhone(ContactsApp.Field.MAIN_PHONE, phone);
      }

    }
    
    
    var address = cell.offset(i, 3).getValue().toString();
    
    // Returns address as an array
    var contAddress = contact
        .getAddresses(ContactsApp.Field.HOME_ADDRESS)[0];
    
    // Update home address if exist otherwise add.
    if(address){

      if(contAddress) {
        contAddress.setAddress(address);
      } else {
        contact.addAddress(ContactsApp.Field.HOME_ADDRESS, 
        address);
      }

    }

  }
};

// Task 3.3
/** 
 *  Gets content of latest unread message in Gmail inbox
 *    and puts gathered data in left most tab of Sheets.
 *
 */
function parseEmail(){

  // Left most sheet/tab
  var emailSheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheets()[0];

  // Clear the entire sheet.
  emailSheet.clear();

  // Checks maximum 10 threads
  var thread = GmailApp.getInboxThreads(0,10);

  var row = 1;

  for(var thrd in thread){
    var messages = thread[thrd].getMessages();

    for (var msg in messages) {
      var message = messages[msg];

      if(message && message.isUnread())
      emailSheet.getRange(row,1).setValue(message.getFrom());

      emailSheet.getRange(row++,2)
      .setValue(message.getPlainBody());
    }
  }

};

// Task 3.4
/**
 *  Checks latest 100 inbox threads,
 *    saves attachments in 'Gmail attachments' folder,
 *
 */
function saveEmailAttachmentsToDrive(){

  // Create 'Gmail Attachments' folder if not exists.
  createFolder_('Gmail attachments');

// Get inbox threads starting from the latest one to 100.
  var threads = GmailApp.getInboxThreads(0, 100);

  var messages = GmailApp.getMessagesForThreads(threads);

  var folderID = PropertiesService.getUserProperties()
      .getProperty("FOLDER");

  var file, folder = DriveApp.getFolderById(folderID);

  for (var i = 0 ; i < messages.length; i++) {
    for (var j = 0; j < messages[i].length; j++) {
      if(!messages[i][j].isUnread()){

        var msgId = messages[i][j].getId();

        // Assign '' if MSG_ID is undefined.
        var oldMsgId = PropertiesService.getUserProperties()
            .getProperty('MSG_ID') || '';

        if(msgId > oldMsgId){
          var attachments = messages[i][j].getAttachments();

          for (var k = 0; k < attachments.length; k++) {
            PropertiesService.getUserProperties()
              .setProperty('MSG_ID', messages[i][j].getId());

            try {
              file = folder.createFile(attachments[k]);
              Utilities.sleep(1000);// Wait before next iteration.
            } catch (e) {
              Logger.log(e);
            }
          }

        }
        else return;

      }
    }
  }

};


function createFolder_(name) {
  var folder, folderID, found = false;

  /*
   * Returns collection of all user folders as an iterator.
   * That means it do not return all folder names at once, 
   * but you should get them one by one.
   *
   */
  var folders = DriveApp.getFolders();

  while (folders.hasNext()) {
    folder = folders.next();
    if (folder.getName() == name) {
      folderID = folder.getId();
      found = true;
      break;
    }
  };

  if (!found) {
    folder = DriveApp.createFolder(name);
    folderID = folder.getId();
  };

  PropertiesService.getUserProperties()
    .setProperty("FOLDER", folderID);

  return folderID;
}

// Task 3.5
function sendEmail(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Form Responses 1");

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var data = sheet.getRange(lastRow,1,1,lastCol)
      .getValues()[0];

  var to = "[[ receiver email id]]";
  var message = "Name: " + data[1] + "\n";

  message += "Phone: " + data[2] + "\n";
  message += "Question: " + data[3] + "\n";

  // MailApp.sendEmail(recipient, subject, body);
  MailApp.sendEmail(to, "Chapter 3", message);
}


// Task 3.5
/**
 *  Checks all unread inbox threads and messages.
 *
 *  If specific keyword found then forwards it to another recipient.
 *
 *  Marks that message as Read.
 *
 */
function forwardEmails() {
  var recipient = "[[ forward email id ]]";

  var words = "[[ keywords separated by | ]]";
  var regExp = new RegExp(words,'g');
  
  var len = GmailApp.getInboxUnreadCount();

  for (var i = 0; i < len; i++) {
    // get 'i'th thread in inbox
    var thread = GmailApp.getInboxThreads(i,1)[0];
    
    // get all messages in 'i'th thread
    var messages = thread.getMessages();
    var msgLen = messages.length;
    var isAllMarkedRead = true;

    // iterate over each message
    // CAUTION: limit loop iterations for initial testing.
    for (var j = 0; j < 1 /* msgLen */; j++) {
      var message = messages[j];

      if(message.isUnread()){
        var bodyText = message.getPlainBody();
        var test = regExp.exec(bodyText);
        message.forward(recipient);
        isAllMarkedRead = false;
        message.markRead();
      }

    };
    
    if(isAllMarkedRead) len++;
    Utilities.sleep(1000);
  }
  
};


// Task 3.6
/**
 * Deletes all the triggers.
 *
 */
function deleteTriggers(){
  var triggers = ScriptApp.getProjectTriggers();

  triggers.forEach(function(trigger){

    try{
      ScriptApp.deleteTrigger(trigger);
    } catch(e) {
      throw e.message;
    };

    Utilities.sleep(1000);

  });

};

function createTrigger(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create new trigger
  ScriptApp.newTrigger("sendEmail")
    .forSpreadsheet(ss).onFormSubmit().create();
};

// Task 3.7
/**
 *  1. Checks all unread inbox threads and messages.
 *
 *  2. If specific keyword found then forwards it to another
 *     recipient.
 *
 *  3. Marks that message as Read.
 *
 */
function forwardEmails() {
  var recipient = "[[forward email id]]";
  /*
   *  Use keywords separated by ‘|’.
   *  For example: “purchase | invoice”
   *
   */
  var words = "keywords list";
  var regExp = new RegExp(words,'g');

  var len = GmailApp.getInboxUnreadCount();

  for (var i = 0; i < len; i++) {
    // get 'i'th thread in inbox
    var thread = GmailApp.getInboxThreads(i,1)[0];

    // get all messages in 'i'th thread
    var messages = thread.getMessages();
    var msgLen = messages.length;
    var isAllMarkedRead = true;

    // iterate over each message
    // CAUTION: limit loop iterations for initial testing.
    for (var j = 0; j < 5 /* msgLen */; j++) {
      var message = messages[j];

      if(message.isUnread()){
        var bodyText = message.getPlainBody();
        var test = regExp.exec(bodyText);
        message.forward(recipient);
        isAllMarkedRead = false;
        message.markRead();
      }

    };

    if(isAllMarkedRead) len++;
    Utilities.sleep(1000);
  }

};


// Task 3.8
function sendEmailWithAttachments(){
  var file = SpreadsheetApp.getActiveSpreadsheet()
      .getAs(MimeType.PDF);

  // MailApp.sendEmail(recipient, subject, body, options)
  MailApp.sendEmail(
    "[[ Recipient email id ]]",
    "Chapter 3",
    "",
    {
      attachments: [file],
      name: 'Chapter 3 test attachment'
    }
  );

}


// Task 3.9
function sendEmail(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Form Responses 1");

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var data = sheet.getRange(lastRow,1,1,lastCol).getValues()[0];

  var image = DriveApp.getFileById("[[image file's id in Drive 
  ]]").getBlob();

  var to = "[[Recipient email id ]]";
  var message = '<img src="cid:logo" />';

  message += "<p>Name: " + data[1] + "</p>";
  message += "<p>Phone: " + data[2] + "</p>";
  message += "<p>Question: " + data[3] + "</p>";

  MailApp.sendEmail(
    to,
    "Chapter 3 inline image example",
    "",
    {
      inlineImages:{ logo:image },
      htmlBody:message
    }
  );
}

//Task 3.10
// Returns your draft text.
function getDraftBody(draftName){
  var drafts = GmailApp.getDraftMessages();

  for(var i in drafts)
    if( drafts[i].getSubject() == draftName )
      return drafts[i].getPlainBody();
}


function sendEmails(){
  // EmailList sheet column numbers, 0 based.
  const FIRST_NAME_COL = 0;
  const EMAIL_IDS_COL = 1;
  const SUB_COL = 2;
  const DATE_COL = 3;

  var maxEmails = 50;
  var draftName = "Chapter 3";// Draft's subject name

  var draftBody = getDraftBody(draftName);
  var quotaLeft = MailApp.getRemainingDailyQuota();

  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("EmailList");

// Gets all sheet data as a 2-dimensional array.  
  var data = sheet.getDataRange().getValues();
  var header = data.shift();

  for(var i=0,count=0; count < maxEmails && count < quotaLeft
      && i < data.length; ++i){
    var firstName = data[i][FIRST_NAME_COL];
    var recipient = data[i][EMAIL_IDS_COL];
    var subject = data[i][SUB_COL];
    var htmlBody = draftBody.replace("<<FirstName>>", firstName);

    if(recipient){
      GmailApp.sendEmail(
        recipient,
        subject,
        "",
        {
          name:"[[ Sender Name ]]",
          htmlBody:htmlBody
        }
      );

      data[i][DATE_COL] = new Date();

      ++count;
    }
  };

  // Inserts header at top of the array.
  data.unshift(header);

  // Stores values of array in sheet.
  sheet.getRange(1, 1, data.length, header.length)
    .setValues(data);
}


