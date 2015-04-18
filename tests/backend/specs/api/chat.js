var assert = require('assert')
 supertest = require(__dirname+'/../../../../src/node_modules/supertest'),
        fs = require('fs'),
       api = supertest('http://localhost:9001');
      path = require('path');

var filePath = path.join(__dirname, '../../../../APIKEY.txt');

var apiKey = fs.readFileSync(filePath,  {encoding: 'utf-8'});
apiKey = apiKey.replace(/\n$/, "");
var apiVersion = 1;
var authorID = "";
var padID = makeid();
var timestamp = Date.now();

describe('API Versioning', function(){
  it('errors if can not connect', function(done) {
    api.get('/api/')
    .expect(function(res){
      apiVersion = res.body.currentVersion;
      if (!res.body.currentVersion) throw new Error("No version set in API");
      return;
    })
    .expect(200, done)
  });
})

// BEGIN GROUP AND AUTHOR TESTS
/////////////////////////////////////
/////////////////////////////////////

/* Tests performed
-> createPad(padID)
 -> createAuthor([name]) -- should return an authorID
  -> appendChatMessage(padID, text, authorID, time)
   -> getChatHead(padID)
    -> getChatHistory(padID)
*/

//TODO test against single surrogates
//TODO test against chars outside BMP
describe('createPad', function(){
  it('creates a new Pad', function(done) {
    api.get(endPoint('createPad')+"&padID="+padID)
    .expect(function(res){
      if(res.body.code !== 0) throw new Error("Unable to create new Pad");
    })
    .expect('Content-Type', /json/)
    .expect(200, done)
  });
})

//TODO test against single surrogates
//TODO test against chars outside BMP
describe('createAuthor', function(){
  it('Creates an author with a name set', function(done) {
    api.get(endPoint('createAuthor'))
    .expect(function(res){
      if(res.body.code !== 0 || !res.body.data.authorID) throw new Error("Unable to create author");
      authorID = res.body.data.authorID; // we will be this author for the rest of the tests
    })
    .expect('Content-Type', /json/)
    .expect(200, done)
  });
})

describe('appendChatMessage', function(){
  it('Adds a chat message to the pad (BMP)', function(done) {
    api.get(endPoint('appendChatMessage')+"&padID="+padID+"&text=ｙ&authorID="+authorID+"&time="+timestamp)
    .expect(function(res){
      if(res.body.code !== 0) throw new Error("Unable to create chat message");
    })
    .expect('Content-Type', /json/)
    .expect(200, done)
  });
  it('Adds a chat message outside BMP and replaces surrogates with U+FFFF', function(done) {
    api.get(endPoint('appendChatMessage')+"&padID="+padID+"&text=\uD835\uDC00&authorID="+authorID+"&time="+timestamp)
    .expect(function(res){
      if(res.body.code !== 0) throw new Error("Cannot send chat message with unicode above U+FFFF");
    })
    .expect('Content-Type', /json/)
    .expect(200, done)
  });
  it('Cannot send a chat message with single high surrogate', function(done) {
    api.get(endPoint('appendChatMessage')+"&padID="+padID+"&text=\uD835&authorID="+authorID+"&time="+timestamp)
    .expect(function(res){
      if(res.body.code !== 1) throw new Error("Can send chat message with high surrogate");
    })
    .expect('Content-Type', /json/)
    .expect(200, done)
  });
  it('Cannot send a chat message with single low surrogate', function(done) {
    api.get(endPoint('appendChatMessage')+"&padID="+padID+"&text=\uDC00&authorID="+authorID+"&time="+timestamp)
    .expect(function(res){
      if(res.body.code !== 1) throw new Error("Can send chat message with low surrogate");
    })
    .expect('Content-Type', /json/)
    .expect(200, done)
  });
})


describe('getChatHead', function(){
  it('Gets the head of chat', function(done) {
    api.get(endPoint('getChatHead')+"&padID="+padID)
    .expect(function(res){
      if(res.body.data.chatHead !== 1) throw new Error("Chat Head Length is wrong");
      if(res.body.code !== 0) throw new Error("Unable to get chat head");
    })
    .expect('Content-Type', /json/)
    .expect(200, done)
  });
})

describe('getChatHistory', function(){
  var chat_history;
  it('Gets Chat History of a Pad', function(done) {
    api.get(endPoint('getChatHistory')+"&padID="+padID)
    .expect(function(res){
      chat_history = res.body.data.messages;
      if(res.body.code !== 0) throw new Error("Unable to get chat history");
      if(chat_history.length !== 2) throw new Error("Chat History Length is wrong");
      if(chat_history[1].text !== "\uFFFD\uFFFD") throw new Error("Unicode above U+FFFF was not replaced");
    })
    .expect('Content-Type', /json/)
    .expect(200, done)
  });
})

var endPoint = function(point){
  return '/api/'+apiVersion+'/'+point+'?apikey='+apiKey;
}

function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ ){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text+"ｙ";
}
