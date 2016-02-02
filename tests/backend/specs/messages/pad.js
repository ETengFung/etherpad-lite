var assert = require('assert')
 supertest = require(__dirname+'/../../../../src/node_modules/supertest'),
        fs = require('fs'),
  settings = require(__dirname+'/../../loadSettings').loadSettings(),
       eplserver = supertest('http://'+settings.ip+":"+settings.port),
      path = require('path'),
     async = require(__dirname+'/../../../../src/node_modules/async');

var filePath = path.join(__dirname, '../../../../APIKEY.txt');

//var apiKey = fs.readFileSync(filePath,  {encoding: 'utf-8'});
//apiKey = apiKey.replace(/\n$/, "");
//var apiVersion = 1;
//var testPadId = makeid();
//var lastEdited = "";

var client = JSON.stringify({
  "component":"pad",
  "type":"CLIENT_READY",
  "padId":"dsfsdfsdfsdf", //FIXME
  "sessionID":"null",
  "password":"null",
  "token":" ",//FIXME
  "protocolVersion":2
})
cookie=""; // global because its set in the first test
iocookie=""; // global because its set in the first test

describe('Get a cookie', function(){
  it('errors if no cookie is set', function(done) {
    eplserver.get('/p/dsfsdfsdfsdf')
    .set('Connection','keep-alive')
    .expect(function(res){
      if(!res.type === "text/html") throw new Error("content-type is not text/html");
      if(!res.header['set-cookie'][0]) throw new Error("Did not receive cookie");
      var m = res.header['set-cookie'][0].match(/express_sid=([^;]+)/);
      if(m){
        cookie = m[0];
        console.log("got cookie",cookie)
      } else {
        throw new Error("express_sid is not set in Cookie");
      }
    })
    .expect(200, done)
  });
})

//FIXME test with websocket transport
describe('Create socket.io connection', function(){
  it('errors if connection cannot be made without token', function(done) {
    eplserver.get('/socket.io/?EIO=3&transport=polling&t=1234-0')
    .set('Cookie',[cookie])
    .set('Connection','keep-alive')
    .expect(function(res){
      if(!res.header['set-cookie'][0]) throw new Error("Did not receive cookie");
      var m = res.header['set-cookie'][0].match(/io=([^;]+)/);
      if(!m)
        throw new Error("express_sid is not set in Cookie");
      iocookie = m[0];
      console.log("received iocookie",iocookie)
    })
    .expect('Content-Type', "application/octet-stream")
    .expect(200, done)
  });
})

describe('Completes socket.io handshake', function(){
  it('errors if handshake could not be completed',function(done) {
    //FIXME do i need to set t=1234
    eplserver.get('/socket.io/?EIO=3&transport=polling&t=1234-1&sid='+iocookie.split("io=")[1])
    .set('Cookie',[cookie+"; "+iocookie])
    .set('Connection','keep-alive')
    .expect(function(res){
      console.log("received response",res.text)
      if(res.text !== '\u0000\u0002�40') {
        throw new Error("Handshake error, received"+res.text)
      }
    })
    .expect(200,done)
  });

  it('errors if client ready is not accepted',function(done) {
    var payload = '42["message",'+client+']';

    eplserver.post('/socket.io/?EIO=3&transport=polling&t=1234-2&sid='+iocookie.split("io=")[1])
    .set('Cookie',[cookie+"; "+iocookie])
    .set('Content-Type', "application/octet-stream")
    .send(payload)
    .expect(function(res){
      console.log("received text",res.text)
      if(res.text !== 'ok') {
        throw new Error("client error, received"+res.text)
      }
    })
    .expect(200,done)
  });

//  it('errors if handshake could not be completed',function(done) {
//    eplserver.get('/socket.io/?EIO=3&transport=polling&t=1234-3&sid='+iocookie.split("io=")[1])
//    .set('Cookie',[cookie+"; "+iocookie])
//    .set('Connection','keep-alive')
//    .set('Content-Type', "application/octet-stream")
//    .set('Accept', "*/*")
//    .expect(function(res){
//      console.log("received response",res.text)
//      if(res.text !== '\u0000\u0002�40') {
//        throw new Error("Handshake error, received"+res.text)
//      }
//    })
//    .expect(200,done)
//  });
})
  //FIXME 
//  it('errors if client_vars is not received',function(done) {
//    eplserver.get('/socket.io/?EIO=3&transport=polling&sid='+iocookie.split("io=")[1])
//    .set('Cookie',[cookie,iocookie])
//    .expect(function(res){
//    //  if(res.text !== 'ok') {
//    //    throw new Error("client error, received"+res.text)
//    //  }
//    })
//    .expect(200,done)
//  });
