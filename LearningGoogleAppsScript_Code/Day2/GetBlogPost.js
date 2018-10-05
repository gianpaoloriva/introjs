/**
 * Show the title and date for the first page of posts on the G Suite
 * Developer blog.
 *
 * @return Two columns of data representing posts on the G Suite
 *     Developer blog.
 * @customfunction
 */
function getBlogPosts() {
  var array = [];
  var url = 'https://gsuite-developers.googleblog.com/atom.xml';
  var xml = UrlFetchApp.fetch(url).getContentText();
  var document = XmlService.parse(xml);
  var root = document.getRootElement();
  var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
  var entries = document.getRootElement().getChildren('entry', atom);
  for (var i = 0; i < entries.length; i++) {
    var title = entries[i].getChild('title', atom).getText();
    var date = entries[i].getChild('published', atom).getValue();
    array.push([title, date]);
  }
  return array;
}
