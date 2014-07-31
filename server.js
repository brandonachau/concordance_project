//
// Simple plain text search server
//
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var booktxt = [];
var contextlen = 30;

app=express();
app.use(bodyParser.json());    
app.use(express.static(__dirname+'/public'));

app.get('/search', function(req, res){
  res.send('Sorry, you need to send a POST request');
});

app.post('/search', function(req, res){
    var body = req.body;
    var rematch = new RegExp(body.term);
    console.log('Searching for: '+body.term);
    var resp = [];
    var matchcount = 0;
    booktxt.forEach(function(line) {
        found = rematch.exec(line)
        if (found) {
            matchcount += 1;
            var match;
            if (found.index < contextlen) {
                // line = '                    '+line;
                line = Array(contextlen+1).join(' ')+line;
                match = line.substring(found.index,found.index+body.term.length+contextlen*2);
            } else {
                match = line.substring(found.index-contextlen,found.index+body.term.length+contextlen);
            }
            resp.push(match);
        }
    });
    if (matchcount > 0) {
        resp.splice(0,0,"")
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ searchterm:body.term, results:resp, count:matchcount}));
});

fs.readFile('books/romeo_juliet.txt',function(err,logData) {
    if (err) throw err;
    var text = logData.toString();
    var lines = text.split('\n');
    lines.forEach(function(line) {
        booktxt.push(line);
    });
    console.log('Loaded books/romeo_juliet.txt');
});

app.listen(8000);
console.log("Serving localhost:8000 from "+__dirname);

