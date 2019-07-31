var express = require('express');
var app = express();

var port = 8080;

app.get('/helloworld',(req,res) => {
    res.send("<h1>Hello world</h1>");
});

app.listen(port,() => {
    console.log(`hello friend! I'm runng at : ${port}`)
});
