var express = require('express');

var app = express();

var myLogger = function(req, res, next){
    console.log('LOGGED');
    next()
}

app.use(myLogger);

app.get('/', function(request, response){
    response.setHeader('Content-Type', 'application/json');
    response.send({
        'course_name':'web enjigenr'
    });
});

app.get('/hello-world', function(request, response){
    response.send('<h1>his is first expreess app hello world.</h1>');
});

app.listen(3000, function(){
    console.log('running on port 3000');
})
