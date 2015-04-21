describe("change username value", function(){

// we need to know because we refresh and want to stay at the same pad
var padID = "FRONTEND_TEST_" + helper.randomString(20);

  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb, padID);
    this.timeout(60000);
  });

  it("Remembers the user name after a refresh", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;

    //click on the settings button to make settings visible
    var $userButton = chrome$(".buttonicon-showusers");
    $userButton.click();
    
    var $usernameInput = chrome$("#myusernameedit");
    $usernameInput.click();
    $usernameInput.focus();

    $usernameInput.val('ｙ');

    setTimeout(function(){ //give it a second to save the username on the server side
      helper.newPad({ // get a new pad, but don't clear the cookies
        clearCookies: false
        , cb: function(){
          var chrome$ = helper.padChrome$;

          //click on the settings button to make settings visible
          var $userButton = chrome$(".buttonicon-showusers");
          $userButton.click();

          var $usernameInput = chrome$("#myusernameedit");
          expect($usernameInput.val()).to.be('ｙ')
          done();
        }
      });
    }, 1000);
  });


  it("Own user name is shown when you enter a chat", function(done) {
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //click on the settings button to make settings visible
    var $userButton = chrome$(".buttonicon-showusers");
    $userButton.click();
    
    var $usernameInput = chrome$("#myusernameedit");
    $usernameInput.click();
    $usernameInput.focus();

    $usernameInput.val('ｙ');

    //click on the chat button to make chat visible
    var $chatButton = chrome$("#chaticon");
    $chatButton.click();
    var $chatInput = chrome$("#chatinput");
    $chatInput.sendkeys('O hi'); // simulate a keypress of typing
    $chatInput.sendkeys('{enter}'); // simulate a keypress of enter actually does evt.which = 10 not 13

    //check if chat shows up
    helper.waitFor(function(){
      return chrome$("#chattext").children("p").length !== 0; // wait until the chat message shows up
    }).done(function(){
      var $firstChatMessage = chrome$("#chattext").children("p");
      var containsBMP = $firstChatMessage.text().indexOf("ｙ") !== -1; // does the string contain BMP
      expect(containsBMP).to.be(true); // expect the first chat message to contain BMP 
      done();
    });
  });

  it("User names with chars outside BMP are ignored", function(done) {
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //click on the settings button to make settings visible
    var $userButton = chrome$(".buttonicon-showusers");
    $userButton.click();
    
    var $usernameInput = chrome$("#myusernameedit");
    $usernameInput.click();
    $usernameInput.focus();

    $usernameInput.val('ｙ\uD835\uDC00');

    //click on the chat button to make chat visible
    var $chatButton = chrome$("#chaticon");
    $chatButton.click();
    var $chatInput = chrome$("#chatinput");
    $chatInput.sendkeys('O hi'); // simulate a keypress of typing
    $chatInput.sendkeys('{enter}'); // simulate a keypress of enter actually does evt.which = 10 not 13

    //check if chat shows up
    helper.waitFor(function(){
      return chrome$("#chattext").children("p").length !== 0; // wait until the chat message shows up
    }).done(function(){
      setTimeout(function(){ //give it a second to save the username on the server side
        helper.newPad({ // get a new pad, but don't clear the cookies
          clearCookies: false
          , cb: function(){
            var chrome$ = helper.padChrome$;

            //click on the settings button to make settings visible
            var $userButton = chrome$(".buttonicon-showusers");
            $userButton.click();

            var $usernameInput = chrome$("#myusernameedit");
            expect($usernameInput.val()).to.be('ｙ')
            done();
          }
        });
      }, 1000);
      done();
    });
  });
});
