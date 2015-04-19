describe("All the alphabet works n stuff", function(){
  var expectedString = "abcdefghijklmnopqrstuvwxyｙz\uD83C\uDCDF";
  var replacedString = expectedString.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,"\uFFFD\uFFFD");

  // we need to know because we refresh the pad
  var padID = "FRONTEND_TEST_" + helper.randomString(20);

  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb, padID);
    this.timeout(60000);
  });

  it("when you enter any char it appears right", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 
    
    //get the first text element out of the inner iframe
    var firstTextElement = inner$("div").first();
    
    // simulate key presses to delete content
    firstTextElement.sendkeys('{selectall}'); // select all
    firstTextElement.sendkeys('{del}'); // clear the first line
    firstTextElement.sendkeys(expectedString); // insert the string

    helper.waitFor(function(){
      return inner$("div").first().text() === expectedString;
    }, 2000).done(done);
  });

  it("after refresh chars above U+FFFF are replaced", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 

    helper.waitFor(function(){
      return inner$("div").first().text() === replacedString;
    }, 2000).done(done);
  });

});
