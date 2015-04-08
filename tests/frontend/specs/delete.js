describe("delete keystroke", function(){
  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  it("makes text delete", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 
    
    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();
    
    // get the original length of this element
    var elementLength = $firstTextElement.text().length;

    // get the original string value minus the last char
    var originalTextValue = $firstTextElement.text();
    originalTextValueMinusFirstChar = originalTextValue.substring(1, originalTextValue.length );

    // simulate key presses to delete content
    $firstTextElement.sendkeys('{leftarrow}'); // simulate a keypress of the left arrow key
    $firstTextElement.sendkeys('{del}'); // simulate a keypress of delete

    //ace creates a new dom element when you press a keystroke, so just get the first text element again
    var $newFirstTextElement = inner$("div").first();
    
    // get the new length of this element
    var newElementLength = $newFirstTextElement.text().length;

    //expect it to be one char less in length
    expect(newElementLength).to.be((elementLength-1));

    done();
  });

  it("deletes a high code from BMP with backspace ", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 
    
    var firstTextElement = inner$("div").first();
    
    firstTextElement.sendkeys('{selectall}');
    firstTextElement.sendkeys('{del}');
    var string = "ｙ"
    firstTextElement.sendkeys(string);
 
    var newLength = inner$("div").first().text().length;
    expect(newLength).to.be(1);
    firstTextElement.sendkeys('{backspace}');

    newLength = inner$("div").first().text().length;
    
    expect(newLength).to.be(0);

    done();
  });

  it("deletes both surrogates with backspace ", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 
    
    var firstTextElement = inner$("div").first();
    
    firstTextElement.sendkeys('{selectall}');
    firstTextElement.sendkeys('{del}');
    var string = "\uD82F\uDCA0\uD82F\uDCA0"
    firstTextElement.sendkeys(string);
 
    firstTextElement.sendkeys('{backspace}');

    var newLength = inner$("div").first().text().length;
    
    expect(newLength).to.be(2);

    done();
  });
  it("deletes one utf-16 encoded code point", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 
    
    var firstTextElement = inner$("div").first();
    
    firstTextElement.sendkeys('{selectall}');
    firstTextElement.sendkeys('{del}');
    var string = "ab\u0300"
    firstTextElement.sendkeys(string);
 
    firstTextElement.sendkeys('{backspace}');

    var newLength = inner$("div").first().text().length;
    
    expect(newLength).to.be(2);

    done();
  });
});
