var assert = require('assert')
 supertest = require(__dirname+'/../../../../src/node_modules/supertest'),
        fs = require('fs'),
  settings = require(__dirname+'/../../loadSettings').loadSettings(),
       eplserver = supertest('http://'+settings.ip+":"+settings.port),
       eplws = supertest('ws://'+settings.ip+":"+settings.port),
      path = require('path'),
     async = require(__dirname+'/../../../../src/node_modules/async');

var ImportError = '<head>         <script type=\'text/javascript\' src=\'../../static/js/jquery.js\'></script>       </head>       <script>         $(window).load(function(){           var impexp = window.parent.padimpexp.handleFrameCall(\'undefined\', \'uploadFailed\');         })       </script>'
var ImportSuccess = '<head>         <script type=\'text/javascript\' src=\'../../static/js/jquery.js\'></script>       </head>       <script>         $(window).load(function(){           var impexp = window.parent.padimpexp.handleFrameCall(\'undefined\', \'ok\');         })       </script>'




describe('Import/Export',function(){
  var padid = makeid();
  it("should import a text document",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/normal_text.txt')
    .field('filename','normal_text.txt')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  it('should export a text document',function(done){
    var testresult = fs.readFileSync('tests/backend/specs/importexport/fixtures/normal_text.txt').toString();
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  it("should import a text document with newlines",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_newlines.txt')
    .field('filename','text_with_newlines.txt')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  it('should export a text document with newlines (txt)',function(done){
    var testresult = fs.readFileSync('tests/backend/specs/importexport/fixtures/text_with_newlines.txt').toString();
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  it('should export a text document with newlines (html)',function(done){
    var testresult = fs.readFileSync('tests/backend/specs/importexport/fixtures/text_with_newlines.txt.html').toString().slice(0,-1);
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });

  var padid = makeid();
  it("should import a text document with newlines",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_newlines.html')
    .field('filename','text_with_newlines.html')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  it('should export a text document with newlines (txt)',function(done){
    var testresult = "htmltext\nnewline\n\n";
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  it('should export a text document with newlines (html)',function(done){
    var testresult = "htmltext<br>newline<br><br>";
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });
  it("should import a document with attributes",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_attributes.html')
    .field('filename','text_with_attributes.html')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  it('should export a document with attributes (txt)',function(done){
    var testresult = "htmltext\nnewline\n\n";
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  it('should export a document with attributes (html)',function(done){
    var testresult = "htmltext<br><strong><em><s><u>newline</u></s></em></strong><br><br>";
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });

  var padid = makeid();
  it("should import a document with bullets",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_bullets.html')
    .field('filename','text_with_bullets.html')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  it('should export a document with bullets (txt)',function(done){
    var testresult = "\t* bullet line 1\n\t* bullet line 2\n\t\t* bullet2 line 1\n\t\t* bullet2 line 2\n\n";
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  it('should export a document with bullets (html)',function(done){
    var testresult = '<ul class="bullet"><li>bullet line 1</li><li>bullet line 2</li><ul class="bullet"><li>bullet2 line 1</li><li>bullet2 line 2</li></ul></ul><br>';
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });
  it("should import a document with bullets and newlines",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_bullets_and_newlines.html')
    .field('filename','text_with_bullets_and_newlines.html')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  it('should export a document with bullets and newlines (txt)',function(done){
    var testresult = "\t* bullet line 1\n\n\t* bullet line 2\n\t\t* bullet2 line 1\n\n\t\t* bullet2 line 2\n\n";
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  it('should export a document with bullets and newlines (html)',function(done){
    var testresult = '<ul class="bullet"><li>bullet line 1</li></ul><br><ul class="bullet"><li>bullet line 2</li><ul class="bullet"><li>bullet2 line 1</li></ul></ul><br><ul><ul class="bullet"><li>bullet2 line 2</li></ul></ul><br>';
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });
  it("should import a document with bullets and newlines and attributes",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_bullets_and_newlines_and_attributes.html')
    .field('filename','text_with_bullets_and_newlines_and_attributes.html')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  it('should export a document with bullets and newlines and attributes (txt)',function(done){
    var testresult = "\t* bullet line 1\n\n\t* bullet line 2\n\t\t* bullet2 line 1\n\n\t\t\t\t* bullet4 line 2 bisu\n\t\t\t\t* bullet4 line 2 bs\n\t\t\t\t* bullet4 line 2 uuis\n\n";
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  it('should export a document with bullets and newlines and attributes (html)',function(done){
    var testresult = '<ul class="bullet"><li>bullet line 1</li></ul><br><ul class="bullet"><li>bullet line 2</li><ul class="bullet"><li>bullet2 line 1</li></ul></ul><br><ul><ul><ul><ul class="bullet"><li><strong><em><s><u>bullet4 line 2 bisu</u></s></em></strong></li><li><strong><s>bullet4 line 2 bs</s></strong></li><li><u>bullet4 line 2 u<em><s>uis</s></em></u></li></ul></ul></ul></ul><br>';
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });

  var padid = makeid();
  it("should import a document with nested bullets",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_nested_bullets.html')
    .field('filename','text_with_nested_bullets.html')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  it('should export a document with nested bullets (txt)',function(done){
    var testresult = '\t* bullet line 1\n\t* bullet line 2\n\t\t* bullet2 line 1\n\t\t\t\t* bullet4 line 2\n\t\t\t\t* bullet4 line 2\n\t\t\t\t* bullet4 line 2\n\t\t\t* bullet3 line 1\n\t* bullet2 line 1\n\n';
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  it('should export a document with nested bullets (html)',function(done){
    var testresult = '<ul class="bullet"><li>bullet line 1</li><li>bullet line 2</li><ul class="bullet"><li>bullet2 line 1</li><ul><ul class="bullet"><li>bullet4 line 2</li><li>bullet4 line 2</li><li>bullet4 line 2</li></ul><li>bullet3 line 1</li></ul></ul><li>bullet2 line 1</li></ul><br>';
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });
  it("should import a document with 8 level bullets",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_8level_bullets.html')
    .field('filename','text_with_8level_bullets.html')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  it('should export a document with 8 level bullets (txt)',function(done){
    var testresult = '\t* bullet line 1\n\n\t* bullet line 2\n\t\t* bullet2 line 1\n\n\t\t\t\t* bullet4 line 2 bisu\n\t\t\t\t* bullet4 line 2 bs\n\t\t\t\t* bullet4 line 2 uuis\n\t\t\t\t\t\t\t\t* foo\n\t\t\t\t\t\t\t\t* foobar bs\n\t\t\t\t\t* foobar\n\n';
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  it('should export a document with 8 level bullets (html)',function(done){
    var testresult = '<ul class="bullet"><li>bullet line 1</li></ul><br>'+
    '<ul class="bullet"><li>bullet line 2</li>'+
    '<ul class="bullet"><li>bullet2 line 1</li></ul></ul><br>'+
    '<ul><ul><ul><ul class="bullet"><li><strong><em><s><u>bullet4 line 2 bisu</u></s></em></strong></li>'+
    '<li><strong><s>bullet4 line 2 bs</s></strong></li>'+
    '<li><u>bullet4 line 2 u<em><s>uis</s></em></u></li>'+
    '<ul><ul><ul><ul class="bullet"><li>foo</li><li><strong><s>foobar bs</s></strong></li>'+
    '</ul></ul></ul><li>foobar</li></ul></ul></ul></ul></ul><br>';
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });
  xit("should import a document with ordered lists",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_ordered_lists.html')
    .field('filename','text_with_ordered_lists.html')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  xit('should export a document with ordered lists (txt)',function(done){
    console.log(padid)
    var testresult = ''; //FIXME
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  xit('should export a document with ordered lists (html)',function(done){
    var testresult = '<ol class="list-number1" start="1"><li>number 1 line 1</li></ol><ol class="list-number1" start="2"><li>number 2 line 2</li></ol>';
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });
  xit("should import a document with ordered lists and newlines",function(done){
    eplserver.post('/p/'+padid+'/import')
    .attach('file','tests/backend/specs/importexport/fixtures/text_with_ordered_lists_and_newlines.html')
    .field('filename','text_with_ordered_lists_and_newlines.html')
    .send()
    .expect(function(res){
      if (res.text !== ImportSuccess) throw new Error("Response from Import is wrong: "+res.text);
    })
    .expect(200, done)
  });
  xit('should export a document with ordered lists and newlines (txt)',function(done){
    console.log(padid)
    var testresult = ''; //FIXME
    eplserver.get('/p/'+padid+'/export/txt')
    .expect(function(res){
      if(res.text !== testresult) throw new Error("Response from Export is wrong: "+res.text)
    })
    .expect(200, done)
  });
  xit('should export a document with ordered lists and newlines (html)',function(done){
    eplserver.get('/p/'+padid+'/export/html')
    .expect(function(res){
      if(extractHtmlBody(res.text) !== testresult) throw new Error("Response from Export is wrong: "+extractHtmlBody(res.text))
    })
    .expect(200, done)
  });

});

function extractHtmlBody(data){
  var start = data.indexOf("<body>")
  var end = data.indexOf("</body>")
  return data.substr(start+6,end-start-6)
}

function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 40; i++ ){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
