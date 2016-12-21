/**
 * Created by gospray on 16-12-20.
 */
var debug = require('debug')('http')
    , http = require('http')
    , name = 'My App';

// fake app

debug('booting %s', name);

http.createServer(function(req, res){
    debug(req.method + ' ' + req.url);
    res.end('hello\n');
}).listen(3000, function(){
    debug('listening');
    console.log("test test");
});