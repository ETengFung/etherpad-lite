var assert = require('assert')
 supertest = require(__dirname+'/../../../../src/node_modules/supertest'),
        fs = require('fs'),
  settings = require(__dirname+'/../../loadSettings').loadSettings(),
       eplserver = supertest('http://'+settings.ip+":"+settings.port),
       eplws = supertest('ws://'+settings.ip+":"+settings.port),
      path = require('path'),
     async = require(__dirname+'/../../../../src/node_modules/async');

var padid = makeid();

describe('Export txt',function(){
  it('should not crash on unknown revision',function(done){
    eplserver.get('/p/'+padid+'/2/export/txt')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400, done)
  });
  it('should not crash on null-string revision',function(done){
    eplserver.get('/p/'+padid+'/null/export/txt')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400,done);
  });
  it('should not crash on undefined-string revision',function(done){
    eplserver.get('/p/'+padid+'/undefined/export/txt')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400,done)
  });
  it('should not crash if revision is a normal string',function(done){
    eplserver.get('/p/'+padid+'/fooo/export/txt')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400,done)
  });

  it('should not crash when revision is empty string',function(done){
    eplserver.get('/p/'+padid+'/""/export/txt')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400,done)
  });
  it('should always create a new pad',function(done){
    eplserver.get('/p/'+padid+'/0/export/txt')
    .expect(function(res){
      if(!res.text || res.text.length === 0){
        throw new Error("empty default text or undefined text?")
      }
    })
    .expect(200, done)
  });
  it('should fail when headrev + 1 is requested',function(done){
    eplserver.get('/p/'+padid+'/1/export/txt')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400, done)
  });
  it('should fail when headrev + 2 is requested',function(done){
    eplserver.get('/p/'+padid+'/2/export/txt')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400, done)
  });
  it('should work if revision is undefined',function(done){
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(!res.text || res.text.length === 0){
        throw new Error("empty default text or undefined text?")
      }
    })
    .expect(200, done)
  });
});
//some as above :-)
describe('Export html',function(){
  it('should not crash on unknown revision',function(done){
    eplserver.get('/p/'+padid+'/2/export/html')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400, done)
  });
  it('should not crash on null-string revision',function(done){
    eplserver.get('/p/'+padid+'/null/export/html')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400,done);
  });
  it('should not crash on undefined-string revision',function(done){
    eplserver.get('/p/'+padid+'/undefined/export/html')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400,done)
  });
  it('should not crash if revision is a normal string',function(done){
    eplserver.get('/p/'+padid+'/fooo/export/html')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400,done)
  });

  it('should not crash when revision is empty string',function(done){
    eplserver.get('/p/'+padid+'/""/export/html')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400,done)
  });
  it('should always create a new pad',function(done){
    eplserver.get('/p/'+padid+'/0/export/html')
    .expect(function(res){
      if(!res.text || res.text.length === 0){
        throw new Error("empty default text or undefined text?")
      }
    })
    .expect(200, done)
  });
  it('should fail when headrev + 1 is requested',function(done){
    eplserver.get('/p/'+padid+'/1/export/html')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400, done)
  });
  it('should fail when headrev + 2 is requested',function(done){
    eplserver.get('/p/'+padid+'/2/export/html')
    .expect(function(res){
      if(res.text !== '') throw new Error("res is not empty")
    })
    .expect(400, done)
  });
  it('should work if revision is undefined',function(done){
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(!res.text || res.text.length === 0){
        throw new Error("empty default text or undefined text?")
      }
    })
    .expect(200, done)
  });
});

function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 40; i++ ){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
