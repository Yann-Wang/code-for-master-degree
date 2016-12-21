/**
 * Created by gospray on 16-12-20.
 */
'use strict';
const http = require('http');
const app = require('koa')();


app.use(function *(next){
   console.log("md 1");
   yield next;
});

app.use(function *(next){
    console.log("md 2");
    yield next;
});

app.use(function *(next){
    console.log("md 3");
    yield next;
});

app.use(function *(next){
    //console.log("md 3");
    this.body = {data:0};
});

const server = http.createServer(app.callback());
server.listen(3000);