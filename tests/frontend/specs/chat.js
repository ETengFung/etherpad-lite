describe("Chat messages and UI", function(){
  // we need to know because we refresh the pad
  var padID = "FRONTEND_TEST_" + helper.randomString(20);

  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb, padID);
    this.timeout(60000);
  });

  it("opens chat, sends a message and makes sure it exists on the page", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 
    // replace code points above U+FFFF with two U+FFFD
    var chatValue = "\uD83C\uDCDFｙ\uD83C\uDCDFｙ\uD83C\uDCDFｙ";

    //click on the chat button to make chat visible
    var $chatButton = chrome$("#chaticon");
    $chatButton.click();
    var $chatInput = chrome$("#chatinput");
    $chatInput.sendkeys(chatValue); // simulate a keypress of typing \uD83C\uDCDFｙ\uD83C\uDCDFｙ\uD83C\uDCDFｙ
    $chatInput.sendkeys('{enter}'); // simulate a keypress of enter actually does evt.which = 10 not 13

    //check if chat shows up
    helper.waitFor(function(){
      return chrome$("#chattext").children("p").length !== 0; // wait until the chat message shows up
    }).done(function(){
      var $firstChatMessage = chrome$("#chattext").children("p");
      var containsMessage = $firstChatMessage.text().indexOf("\uD83C\uDCDFｙ\uD83C\uDCDFｙ\uD83C\uDCDFｙ") !== -1; // does the string contain ｙ and U+FFFD?
      expect(containsMessage).to.be(true); // expect the first chat message to contain JohnMcLear

      // do a slightly more thorough check
      var username = $firstChatMessage.children("b");
      var usernameValue = username.text();
      var time = $firstChatMessage.children(".time");
      var timeValue = time.text();
      var discoveredValue = $firstChatMessage.text();
      var chatMsgExists = (discoveredValue.indexOf("\uD83C\uDCDFｙ\uD83C\uDCDFｙ\uD83C\uDCDFｙ") !== -1);
      expect(chatMsgExists).to.be(true);
      done();
    });

  });

  it("after refresh, chat message is replaced", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 
    // replace code points above U+FFFF with two U+FFFD
    var chatValue = "\uFFFD\uFFFDｙ\uFFFD\uFFFDｙ\uFFFD\uFFFDｙ";

    //check if chat shows up
    helper.waitFor(function(){
      return chrome$("#chattext").children("p").length !== 0; // wait until the chat message shows up
    }).done(function(){
      var $firstChatMessage = chrome$("#chattext").children("p");

      // do a slightly more thorough check
      var username = $firstChatMessage.children("b");
      var usernameValue = username.text();
      var time = $firstChatMessage.children(".time");
      var timeValue = time.text();
      var discoveredValue = $firstChatMessage.text();
      var chatMsgExists = (discoveredValue.indexOf(chatValue) !== -1);
      expect(chatMsgExists).to.be(true);
      done();
    });

  });

  it("makes sure that an empty message can't be sent", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 

    //click on the chat button to make chat visible
    var $chatButton = chrome$("#chaticon");
    $chatButton.click();
    var $chatInput = chrome$("#chatinput");
    $chatInput.sendkeys('{enter}'); // simulate a keypress of enter (to send an empty message)
    $chatInput.sendkeys('mluto'); // simulate a keypress of typing mluto
    $chatInput.sendkeys('{enter}'); // simulate a keypress of enter (to send 'mluto')

    //check if chat shows up
    helper.waitFor(function(){
      return chrome$("#chattext").children("p").length !== 0; // wait until the chat message shows up
    }).done(function(){
      // check that the empty message is not there
      expect(chrome$("#chattext").children("p").length).to.be(2);
      // check that the received message is not the empty one
      var $firstChatMessage = chrome$("#chattext").children("p");
      var containsMessage = $firstChatMessage.text().indexOf("mluto") !== -1;
      expect(containsMessage).to.be(true);
      done();
    });
  });

  it("makes chat stick to right side of the screen", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 

    //click on the settings button to make settings visible
    var $settingsButton = chrome$(".buttonicon-settings");
    $settingsButton.click();

    //get the chat selector
    var $stickychatCheckbox = chrome$("#options-stickychat");

    //select chat always on screen and fire change event
    $stickychatCheckbox.attr('selected','selected');
    $stickychatCheckbox.change();
    $stickychatCheckbox.click();

    //check if chat changed to get the stickychat Class
    var $chatbox = chrome$("#chatbox");
    var hasStickyChatClass = $chatbox.hasClass("stickyChat");
    expect(hasStickyChatClass).to.be(true);

    //select chat always on screen and fire change event
    $stickychatCheckbox.attr('selected','selected');
    $stickychatCheckbox.change();
    $stickychatCheckbox.click();

    //check if chat changed to remove the stickychat Class
    var hasStickyChatClass = $chatbox.hasClass("stickyChat");
    expect(hasStickyChatClass).to.be(false);

    done();
  });

  it("makes chat stick to right side of the screen then makes it one step smaller", function(done) {
    var inner$ = helper.padInner$; 
    var chrome$ = helper.padChrome$; 

    //click on the settings button to make settings visible
    var $settingsButton = chrome$(".buttonicon-settings");
    $settingsButton.click();

    //get the chat selector
    var $stickychatCheckbox = chrome$("#options-stickychat");

    //select chat always on screen and fire change event
    $stickychatCheckbox.attr('selected','selected');
    $stickychatCheckbox.change();
    $stickychatCheckbox.click();

    //check if chat changed to get the stickychat Class
    var $chatbox = chrome$("#chatbox");
    var hasStickyChatClass = $chatbox.hasClass("stickyChat");
    expect(hasStickyChatClass).to.be(true);

    //select chat always on screen and fire change event
    chrome$('#titlecross').click();

    //check if chat changed to remove the stickychat Class
    var hasStickyChatClass = $chatbox.hasClass("stickyChat");
    expect(hasStickyChatClass).to.be(false);

    done();
  });
});
