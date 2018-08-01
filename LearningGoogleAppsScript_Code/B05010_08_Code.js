// Replace with your spreadsheet's ID.
var ss = SpreadsheetApp
    .openById("spreadsheet id");

var SheetOrders = ss.getSheetByName("Orders");
var SheetStock = ss.getSheetByName("Stock");


function doGet(e){
  var delivered = e.parameter.delivered;
  
  if(delivered){
    // If order delivered then just update delivery date.
    updateDelivery(e);
    
    // Returning text content is enough, HtmlService not needed.
    return ContentService.createTextOutput("Thank you!");
  }
  
  var orderNumber = e.parameter.order_number;

  if(orderNumber){
    
    /*
     *  If order number present in query string
     *  then serve dispatch form to order processing unit.
     *
     */
    var template = HtmlService.createTemplateFromFile("Despatch");
    var data = SheetOrders.getDataRange().getValues();
    
    for(var i in data){
      if( data[i][0] == orderNumber ){
        template.order = data[i];
        break;
      }
    };

  } else {

    /*
     *  If order number not present in query string
     *  then serve order form to the user.
     *
     */
    var template = HtmlService.createTemplateFromFile("Order");
    template.pricelist = getPrice();
    
  };
    
  var html = template.evaluate();
  return HtmlService.createHtmlOutput(html);
}


function getPrice(index){
  var data = SheetStock.getDataRange().getValues();
  
  // remove header row.
  data.shift();
  
  return typeof index == "undefined" ? data : data[index][1];
}


function isValidEmail_(email) {
  var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
  return regex.test(email);
}


function postOrder(form){
  
  // Validate user email
  if( !isValidEmail_(form.email) )
    throw "please provide a valid email id.";

  /*
   *  Date used as order number, 
   *  which helps to have distinctive number.
   *  However, you may use any other number or string.
   *
   *  Prepend 'new' with '+' to get 'value' (number) of the date.
   *
   */
  var orderNumber = +new Date();
  
  // Construct form element values in an array.
  var order = [
    orderNumber,
    form.item,
    form.unit_price,
    form.quantity,
    form.total_price,
    form.delivery_address,
    form.phone,
    form.email,
    form.payment_details
  ];
  
  SheetOrders.appendRow(order);
  
  var htmlBody = "<p>Order number: " + orderNumber + "</p>";
  htmlBody += "<p>Item: " + form.item + "</p>";
  htmlBody += "<p>Unit price: " + form.unit_price + "</p>";
  htmlBody += "<p>Quantity: " + form.quantity + "</p>";
  htmlBody += "<p>Total price: " + form.total_price + "</p>";
  htmlBody += "<p>Delivery address: " + form.delivery_address
              + "</p>";

  htmlBody += "<p>Phone number: " + form.phone + "</p>";
  htmlBody += "<p>Payment details: " + form.payment_details
              + "</p>";

  htmlBody += "<p>Please quote the order number in your ” 
              + “correspondance.</p>";
  
  // Send an e-mail to the user.
  MailApp.sendEmail({
    to: form.email,
    subject: "Order placed",
    htmlBody: htmlBody
  });
  
  htmlBody += "<p>&nbsp;</p>";
  htmlBody += '<p>Click <a href="'
              + ScriptApp.getService().getUrl()
              + '?order_number=' + orderNumber
              + '" >here</a> to dispatch the order.</p>';
  
  /*
   * Send an e-mail to the Accounts department with the same 
   * content as to the user e-mail, additionally a clickable URL 
   * with the order number appended as a query to the published 
   * URL.
   *
   */
  MailApp.sendEmail({
    to: "Accounts department email id",
    subject: "Order - " + orderNumber,
    htmlBody: htmlBody
  });
  
  // Return confirmation message to user.
  return "Order placed successfully and more details ” \
         + “has been sent to " + form.email;
};


function dispatchOrder(form){
  // Shipment details column number minus 1.
  const SHIPMENT_DETAILS = 9;
  
  var orderNumber = form.order_number;
  var deliveryAddress = form.delivery_address;
  var userEmail = form.email;
  var shipmentDetails = form.shipment_details;
  
  var data = SheetOrders.getDataRange().getValues();
  
  for(var i = 0; i < data.length; i++){
    if(data[i][0] == orderNumber){
      SheetOrders.getRange(i+1, SHIPMENT_DETAILS+1)
        .setValue(shipmentDetails);
      
      var htmlBody = "<p>Order number: "
          + orderNumber + " has been dispatched to </p>"
          + "<p>" + deliveryAddress + "</p>"
          + "<p>By " + shipmentDetails + "</p>"
          + "<p>&nbsp;</p>"
          + '<p>Click <a href="' + ScriptApp.getService().getUrl()
          + '?order_number=' + orderNumber
          + '&delivered=true" >here</a> '
          + 'to acknowledge the delivery.</p>';
      
      // Send email to the user
      MailApp.sendEmail({
        to: userEmail,
        subject: "Order dispatched",
        htmlBody: htmlBody
      });
      
      // Return confirmation to the dispatch team.
      return "Shipment details updated and user notified by ” \
             + “an e-mail.";
    }
  };
  
  // Displays error if query order_number not found in sheet.
  throw "Order number not found.";
};


function updateDelivery(e){
  // Delivery date column number minus one.
  const DELIVERED_ON = 10;
  
  var orderNumber = e.parameter.order_number;
  var deliveryDate = new Date();
  var data = SheetOrders.getDataRange().getValues();
  
  // Update delivery date on matched order number.
  for(var i = 0; i < data.length; i++){
    if(""+data[i][0] == orderNumber){
      SheetOrders.getRange(i+1, DELIVERED_ON+1)
        .setValue(deliveryDate);
    }
  };
}


<!-- Order.html -->
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    
    <link rel="stylesheet" 
     href="//ssl.gstatic.com/docs/script/css/add-ons1.css" />
     
    <script src="//ajax.googleapis.com/ajax/libs/ 
     jquery/1.10.2/jquery.min.js"></script>
    
    <script>
        // On document load, assigns events to elements.
        $(function(){
        $("#item").change(getUnitPrice);
        $("#quantity").change(calcTotalPrice);
        $("#btnSubmit").click(submit);
      });
      
      /*
       * Retrieves corresponding unit price for the selected item
       * and calculates the total price.
       *
       */
      function getUnitPrice(){
        google.script.run
        .withSuccessHandler(function(price){
          $("#unit_price").val(price);
          calcTotalPrice();
        })
        .getPrice( $("#item").prop("selectedIndex") );
      };

      function calcTotalPrice(){
        $("#total_price").val( $("#unit_price").val() * 
        $("#quantity").val() );
      };
      
      function submit(){
        // Remove already displayed messages, if any.
        $("#success,#error").remove();

        this.disabled = true;

        google.script.run
          .withSuccessHandler(function(msg,elm){
             elm.disabled = false;
             showSuccess(msg,elm);
           })
          .withFailureHandler(function(msg, elm){
             elm.disabled = false;
             showError(msg, elm);
           })
          .withUserObject(this)
          .postOrder( this.parentNode );
          // submit button's parent, i.e. form.
      }
      

      function showSuccess(msg,elm) {
        var span = $('<span id="success"> 
        <font color="green"> ' + msg + '</font></span>');

        $(elm).after(span);
      }
      

      function showError(msg,elm) {
        var span = $('<span id="error" class="error"> ' 
        + msg + '</span>');

        $(elm).after(span);
      }
    </script>
  </head>
  
  <body>
    <form>
      <table>
        <tr>
        <td><label>Select Item:</label></td>
        <td><select id="item" name="item">
          <? for(var i in pricelist){ ?>
              <option value="<?= pricelist[i][0] ?>" ><?= 
               pricelist[i][0] ?></option>
          <? } ?>
        </select></td>
        </tr>
        
        <tr>
        <td><label>Unit price:</label></td>
        <td><input id="unit_price" name="unit_price" type="text" 
              readonly value="<?= pricelist[0][1] ?>" /></td>
        </tr>
        
        <tr>
        <td><label>Quantity:</label></td>
        <td><input id="quantity" name="quantity" type="number" 
              value="1" /></td>
        </tr>

        <tr>
        <td><label>Total price:</label></td>
        <td><input id="total_price" name="total_price" type="text" 
              readonly value="<?= pricelist[0][1] ?>" /></td>
        </tr>
        
        <tr>
        <td><label>Deliver to:</label></td>
        <td><textarea name="delivery_address"
              placeholder="Enter delivery address.">
              </textarea></td>
        </tr>
        
        <tr>
        <td><label>Phone:</label></td>
        <td><input name="phone" type="phone"
              placeholder="Enter phone number." /></td>
        </tr>
        
        <tr>
        <td><label>E-Mail:</label></td>
        <td><input name="email" type="email"
              placeholder="Enter email address." /></td>
        </tr>
        
        <tr>
        <td><label>Payment details:</label></td>
        <td><input name="payment_details" type="text" 
              placeholder="Enter payment details." /></td>
        </tr>
      </table>
      
      <br />
      <input class="blue" id="btnSubmit" type="button" 
        value="Submit" />
    </form>
  </body>
</html>


<!-- Dispatch.html -->
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <link rel="stylesheet" 
     href="//ssl.gstatic.com/docs/script/css/add-ons1.css" />
    <script 
     src="//ajax.googleapis.com/ajax/libs/jquery/ 
     1.10.2/jquery.min.js"></script>
    
    <script>
      // On document load, assign submit function to the submit
      //  button’s click event
      $(function(){
        $("#btnSubmit").click(submit);
      });
      

      function submit(){
        // Remove already displayed messages, if any.
        $("#success,#error").remove();
        this.disabled = true;

        google.script.run
          .withSuccessHandler(function(msg,elem){
             elem.disabled = false;
             showSuccess(msg,elem);
           })
          .withFailureHandler(function(msg, elm){
             elm.disabled = false;
             showError(msg, elm);
           })
          .withUserObject(this)
          .dispatchOrder( this.parentNode );
      }
      

      function showSuccess(msg,elm) {
        var span = $('<span id="success"> 
        <font color="green"> ' + msg + '</font></span>');
        $(elm).after(span);
      }
      

      function showError(msg,elm) {
        var span = $('<span id="error" class="error"> ' 
        + msg + '</span>');
        $(elm).after(span);
      }
    </script>
  </head>
  
  <body>
    <form>
      <table>
        <tr>
        <td><label>Order number:</label></td>
        <td><input name="order_number" 
             type="text" readonly value="<?= order[0] ?>" /></td>
        </tr>

        <tr>
        <td><label>Item:</label></td>
        <td><input type="text" readonly
             value="<?= order[1] ?>" /></td>
        </tr>
        
        <tr>
        <td><label>Quantity:</label></td>
        <td><input type="number" readonly
             value="<?= order[3] ?>" /></td>
        </tr>

        <tr>
        <td><label>Deliver to:</label></td>
        <td><textarea readonly value="<?= order[5] ?>"> 
             </textarea></td>
        </tr>

        <tr>
        <td><label>Shipment details:</label></td>
        <td><textarea name="shipment_details" 
              placeholder="Enter shipment details." >
              </textarea></td>
        </tr>
        
        <tr>
        <td><input name="email" type="hidden"
             value="<?= order[7] ?>" /></td>
        </tr>
      </table>
      
      <br />
      <input class="blue" 
       id="btnSubmit" type="button" value="Submit" />
    </form>
  </body>
</html>
