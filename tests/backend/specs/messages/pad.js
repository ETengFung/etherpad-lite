//FIXME the tests use polling, need to extend this to other transports?
//FIXME what to do with token and t-query parameter for socket.io

var assert = require('assert')
 supertest = require(__dirname+'/../../../../src/node_modules/supertest'),
        fs = require('fs'),
  settings = require(__dirname+'/../../loadSettings').loadSettings(),
       eplserver = supertest('http://'+settings.ip+":"+settings.port),
      path = require('path'),
     async = require(__dirname+'/../../../../src/node_modules/async'),
     helper = require(__dirname+'/helper.js')

    
// polling, and we need to GET our response
function transportGet(){
  var response;
  eplserver.get(transporturl)
  .set(headers)
  .expect(function(err,res){
    console.log("this is err",err)
    console.log("this is our response",res)
    reponse = res
  })
  .expect(200);

  return response;
}

// initialize some variables
// FIXME they should not be global
before(function(){
  cookie = "";
  iocookie = "";
  authorId = "";
  testPadId = helper.makeid();
  client = JSON.stringify({
    "component":"pad",
    "type":"CLIENT_READY",
    "padId":testPadId,
    "sessionID":"null",
    "password":"null",
    "token":" ",
    "protocolVersion":2
  })
  headers = {
    'Connection':'keep-alive',
    'Content-Type':'application/octet-stream'
  }
  transporturl = "";
})


describe('pad session init', function(){
  it("fails if express_sid cookie was not sent",function(done){
    eplserver.get('/p/'+testPadId)
    .set(headers)

    .expect(function(res){
      for (var i = 0; i < res.header['set-cookie'].length; i++){
        var m = res.header['set-cookie'][i].match(/express_sid=([^;]+)/);
      }
      if(m){
        cookie = m[0];
        headers['Cookie'] = cookie;
      } else {
        throw new Error("express_sid cookie not set");
      }
    })
    .expect(200,done)
  })

  it('fails if socket.io cookie was not sent', function(done) {
    eplserver.get('/socket.io/?EIO=3&transport=polling')
    .set(headers)

    .expect(function(res){
      var m = res.header['set-cookie'][0].match(/io=([^;]+)/);
      if(m){
        iocookie = m[0];
        headers['Cookie'] += "; "+iocookie;
        transporturl = '/socket.io/?EIO=3&transport=polling&sid='+iocookie.split("io=")[1]
      } else {
        throw new Error("socketio cookie is not set");
      }
    })
    .expect(200, done)
  });

  it('fails if handshake could not be completed',function(done) {
    eplserver.get(transporturl)
    .set(headers)

    .expect(function(res){
      if(res.text !== '\u0000\u0002�40') {
        throw new Error("Handshake error, received"+res.text)
      }
    })
    .expect(200,done)
  });

  it('fails if client cannot join padroom',function(done) {
    var payload = helper.payload_gen('42["message",'+client+']');
    var length = payload.length;

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)

    .end(function(err,res){
      if(!res.text.match(/ok/)){
        throw new Error("Did not accept message")
      }
      done();
    })
    .expect(200)
  });

  it('fails if CLIENT_VARS are not sent',function(done) {
    eplserver.get(transporturl)
    .set(headers)

    .expect(function(res){
      if(!res.text || !res.text.match(/CLIENT_VARS/)) {
        throw new Error("Response does not contain CLIENT_VARS")
      }
      authorId = res.text.match(/userId":"([^"]*)"/)[1];
      if(!authorId.indexOf("a.") === 1 )
        throw new Error("userID was not set")

    })
    .expect(200,done)
  });
}); //end session init

describe("changeset request handling",function(){
  //FIXME should not return ok
  //Dropped message, changeset request has no data!
  xit('fails if data is not given',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad"}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)

    .end(function(err,res){
      if(res.text.match(/ok/)){
        throw new Error("Did accept CHANGESET_REQ without data ")
      }
      done()
    })
    .expect(200)
    console.log(transportGet());
  });

  //FIXME should not return ok
  xit('fails if no padId is given',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad","data":{"":""}}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)

    .end(function(err,res){
      if(res.text.match(/ok/)){
        throw new Error("Did accept CHANGESET_REQ without padId")
      }
      done()
    })
    .expect(200)
  });
  xit('fails if no granularity is given',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad","padId":"'+JSON.parse(client).padId+'","data":{"":""}}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)
    .end(function(err,res){
      if(res.text.match(/ok/)){
        throw new Error("Did accept CHANGESET_REQUEST without granularity")
      }
      done()
    })
    .expect(200)
  });
  xit('fails if granularity is negative',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad","padId":"'+JSON.parse(client).padId+'","data":{"granularity":"-1"}}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)
    .end(function(err,res){
      if(res.text.match(/ok/)){
        throw new Error("Did accept CHANGESET_REQUEST with negative granularity")
      }
      done()
    })
    .expect(200)
  });
  xit('fails if no start is given',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad","padId":"'+JSON.parse(client).padId+'","data":{"granularity":0.0}}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)
    .end(function(err,res){
      if(res.text.match(/ok/)){
        throw new Error("Did accept CHANGESET_REQUEST without start")
      }
      done()
    })
    .expect(200)
  });

  xit('fails with CHANGESET_REQ when start is a string',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad","padId":"'+JSON.parse(client).padId+'","data":{"granularity":0,"start":"foo","requestID":23}}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)

    .end(function(err,res){
      if(res.text.match(/ok/)){
        throw new Error("Could sent CHANGESET_REQUEST when start is a string")
      }
      done();
    })
  });
  xit('fails with CHANGESET_REQ when start or end is a string',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad","padId":"'+JSON.parse(client).padId+'","data":{"granularity":0,"end":"foo","start":"foo","requestID":23}}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)

    .end(function(err,res){
      if(res.text.match(/ok/)){
        throw new Error("Could sent CHANGESET_REQUEST when start or end is a string")
      }
    })
    
    //the answer is in the next GET
    eplserver.get(transporturl)
    .set(headers)

    .expect(function(res){
      if(res.text.match(/CHANGESET_REQ/)){
        throw new Error("CHANGESET_REQ was received");
      }
    })
    .expect(200,done)
  });

  xit('fails if valid CHANGESET_REQ with granularity 0 is not answered',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad","padId":"'+JSON.parse(client).padId+'","data":{"granularity":0,"start":0,"end":10,"requestID":23}}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)
    .end(function(err,res){
      if(!res.text.match(/ok/)){
        throw new Error("Did not accept CHANGESET_REQUEST")
      }
    })
    .expect(200)

    //the answer is in the next GET
    eplserver.get(transporturl)
    .set(headers)

    .expect(function(res){
      if(!res.text.match(/CHANGESET_REQ/)){
        throw new Error("CHANGESET_REQ was received");
      }
    })
    .expect(200,done)
  });
  xit('fails if valid CHANGESET_REQUEST is not answered',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad","padId":"'+JSON.parse(client).padId+'","data":{"granularity":1,"start":0,"end":10,"requestID":23}}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)
    .end(function(err,res){
      if(!res.text.match(/ok/)){
        throw new Error("Did not accept CHANGESET_REQUEST")
      }
      done()
    })
    .expect(200)
  });
  //CRASH
  //Error: Not a exports: undefined
  //    at Object.error (/home/etherpad-lite-tests/databases/mysql/src/static/js/Changeset.js:39:11)
  //    at Object.exports.unpack (/home/etherpad-lite-tests/databases/mysql/src/static/js/Changeset.js:1002:13)
  //    at Object.exports.inverse (/home/etherpad-lite-tests/databases/mysql/src/static/js/Changeset.js:2010:26)
  //    at async.series.callback.forwardsChangesets (/home/etherpad-lite-tests/databases/mysql/src/node/handler/PadMessageHandler.js:1541:35)
  //returns?? {"code":1,"message":"Session ID unknown"}
  xit('fails if CHANGESET_REQ with negative start is answered',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"CHANGESET_REQ","component":"pad","padId":"'+JSON.parse(client).padId+'","data":{"granularity":1,"start":-1,"requestID":24}}]');
    var length = payload.toString().length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',length)
    .send(payload)
    .end(function(err,res){
      console.log("THIS IS THE RESPONSE",res.text)
      if(!res.text.match(/ok/)){
        throw new Error("Did not accept CHANGESET_REQUEST")
      }
      done()
    })
    .expect(200)
  });

  //FIXME should return not ok, because server says Dropped message, unknown COLLABROOM Data  Type CHANGESET_REQUEST
  xit('fails if CHANGESET_REQ could not be sent',function(done) {
    var payload = helper.payload_gen('42["message",{"type":"COLLABROOM","component":"pad","data":{"type":"CHANGESET_REQUEST"}}]');

    var payload_length = payload.length

    eplserver.post(transporturl)
    .set(headers)
    .set('Content-Length',payload_length)
    .send(payload)

    .end(function(err,res){
      if(!res.text.match(/ok/)){
        throw new Error("Did not accept CHANGESET_REQUEST")
      }
      done()
    })
    .expect(200)
  });
});
