var assert = require('assert')
 supertest = require(__dirname+'/../../../../src/node_modules/supertest'),
        fs = require('fs'),
  settings = require(__dirname+'/../../loadSettings').loadSettings(),
       eplserver = supertest('http://'+settings.ip+":"+settings.port),
       eplws = supertest('ws://'+settings.ip+":"+settings.port),
      path = require('path'),
     async = require(__dirname+'/../../../../src/node_modules/async'),
    // helper = require(__dirname+'/helper.js')

describe('Export txt',function(){
  xit('should not crash on unknown revision',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/2/export/txt')
    .expect(function(res){
    })
    .expect(200, done)
  });
  xit('should not crash on undefined revision',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf//export/txt')
    .expect(function(res){
    })
    .expect(404,done);
  });
  xit('should not crash when revision is a string',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/undefined/export/txt')
    .expect(function(res){
      if(typeof res.text !== 'string') throw new Error("res is not string")
    })
    .expect(200,done)
  });
  xit('should not crash when revision is a string',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/fooo/export/txt')
    .expect(function(res){
      if(typeof res.text !== 'string') throw new Error("res is not string")
    })
    .expect(200,done)
  });

  xit('should not crash when revision is empty string',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/""/export/txt')
    .expect(function(res){
      if(typeof res.text !== 'string') throw new Error("res is not string")
    })
    .expect(200,done)
  });
  xit('should always create a new pad',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/0/export/txt')
    .expect(function(res){
      if(!res.text || res.text.length === 0){
        throw new Error("empty default text or undefined text?")
      }
    })
    .expect(200, done)
  });
  xit('should fail when headrev + 1 is requested',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/10/export/txt')
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
  xit('should not crash on unknown revision',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/2/export/html')
    .expect(function(res){
    })
    .expect(200, done)
  });
  it('should not crash on undefined revision',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf//export/html')
    .expect(function(res){
    })
    .expect(404,done);
  });
  it('should not crash when revision is a string',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/undefined/export/html')
    .expect(function(res){
      if(typeof res.text !== 'string') throw new Error("res is not string")
    })
    .expect(200,done)
  });
  it('should not crash when revision is a string',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/fooo/export/html')
    .expect(function(res){
      if(typeof res.text !== 'string') throw new Error("res is not string")
    })
    .expect(200,done)
  });

  it('should not crash when revision is empty string',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/""/export/html')
    .expect(function(res){
      if(typeof res.text !== 'string') throw new Error("res is not string")
    })
    .expect(200,done)
  });
  it('should always create a new pad',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/0/export/html')
    .expect(function(res){
      if(!res.text || res.text.length === 0){
        throw new Error("empty default text or undefined text?")
      }
    })
    .expect(200, done)
  });
  it('should fail when headrev + 1 is requested',function(done){
    eplserver.get('/p/dsfjsdknfsdjkfnsdjfnsdf/10/export/html')
    .expect(function(res){
//      console.log(res)
      if(!res.text || res.text.length === 0){
        throw new Error("empty default text or undefined text?")
      }
    })
    .expect(200, done)
  });
});
