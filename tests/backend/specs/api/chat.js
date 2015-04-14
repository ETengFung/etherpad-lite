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
  it('Chat message outside BMP is added and replaced', function(done) {
    api.get(endPoint('appendChatMessage')+"&padID="+padID+"&text=\uD835\uDC00&authorID="+authorID+"&time="+timestamp)
    .expect(function(res){
      if(res.body.code !== 0) throw new Error("Could not send chat message with unicode above U+FFFF");
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
  it('Gets Chat History of a Pad', function(done) {
    api.get(endPoint('getChatHistory')+"&padID="+padID)
    .expect(function(res){
      console.error("chatlength:",res.body.data.messages)
      if(res.body.data.messages.length !== 2) throw new Error("Chat History Length is wrong");
      if(res.body.code !== 0) throw new Error("Unable to get chat history");
    })
    .expect('Content-Type', /json/)
    .expect(200, done)
  });
  it('Gets the last chat message (with replaced character)', function(done) {
    api.get(endPoint('getChatHistory')+"&padID="+padID+"&start=0&end=1")
    .expect(function(res){
      if(res.body.data.messages.length !== 2) throw new Error("Chat History Length is wrong");
      if(res.body.code !== 0) throw new Error("Unable to get chat history");
      if(res.body.data.messages[1].text !== "\uFFFD\uFFFD") throw new Error("char in chat message with unicode above U+FFFF was not replaced");
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

  for( var i=0; i < 4; i++ ){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text+"ｙ";
}
