const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const jwt_secret = 'WU5CjF8fHxG40S2t7oyk';

var jwt    = require('jsonwebtoken');
var MongoId = require('mongodb').ObjectID;
var md5 = require('md5');
var db;



app.use('/', express.static('examples'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));


var usr = "";
app.post('/login', function(request, response){
  var user = request.body;


  db.collection("users").findOne({'username': user.username, 'password': md5(user.password)}, function(error, uuser) {
    if (error){
      throw error;
    }else{
      if(uuser){
        var token = jwt.sign(uuser, jwt_secret, {
          expiresIn: 20000 
        });
        usr = user.username;
        response.send({
          success: true,
          message: 'Authenticated',
          token: token
        })
      }
            else{
              response.status(401).send('Credentials are wrong.');
            }
          }
        });
    

});

app.post('/register', function(request, response){
  var user = request.body;

  db.collection("users").save( { "username" : user.username, "password" : md5(user.password) , "location" : user.location, "age" : user.age, "interests" : user.interests , "type" : user.type, "familystatus" : user.family, "moneyearned" : 22131 , "facebook" : 21331, "instagram" : 13131,  "twitter" : 3213,  "adsposted" : 67, "peoplereached" : 51252, "pendingposts" : 13} , function(error) {
    if (error){
      throw error;
    }
  });  
  
  var token = jwt.sign(user, jwt_secret, {
    expiresIn: 20000 
  });
  response.send({
    success: true,
    message: 'Registred',
    token: token
  })

});

app.post('/addtrans', function(request, response){
  var trans = request.body;

  db.collection("transactions").save( { "transactor" : usr, "receiver" : trans.user, "amount" : trans.amount, "description" : trans.description } , function(error) {
    if (error){
      throw error;
    }
  });  
  
});

app.post('/connect_user', function(request, response){
   var message = request.body;
   var topic = message.message.substr(0,10);

    db.collection("connections").save( { "advertiser" : usr , "user" : message.user , "message" : message.message, "topic" : topic , "paymentmethod" : "none"} , function(error) {
      if (error){
        throw error;
      }
    }); 
  
});

app.post('/connect_provider', function(request, response){
  var message = request.body;
  var topic = message.message.substr(0,10);

   db.collection("connections").save( { "advertiser" : message.advertiser , "user" : usr , "message" : message.message, "topic" : topic  , "paymentmethod" : "none"} , function(error) {
     if (error){
       throw error;
     }
   }); 
 
});



app.get('/user', function(request, response){
  db.collection('users').find({username : usr}).toArray((err, users) => {
    if (err) return console.log(err);
    // localStorage.setItem('uname', users.username);
    response.setHeader('Content-Type', 'application/json');
    response.send(users);
  })
});


app.get('/data', function(request, response){
  db.collection('users').find({username : usr}).toArray((err, info) => {
    if (err) return console.log(err);
    response.setHeader('Content-Type', 'application/json');
    response.send(info);
  })
});

app.get('/connections', function(request, response){
  db.collection('connections').find({ $or: [ { advertiser : usr}, {user : usr} ] }).toArray((err, connections) => {
    if (err) return console.log(err);
    response.setHeader('Content-Type', 'application/json');
    response.send(connections);
  })
});

app.get('/gettransactions', function(request, response){
  db.collection('transactions').find({ $or: [ { transactor : usr}, {receiver : usr} ] }).toArray((err, transactions) => {
    if (err) return console.log(err);
    response.setHeader('Content-Type', 'application/json');
    response.send(transactions);
  })
});


app.get('/users/:family/:interests/:location/:age', function(request, response){
  db.collection('users').find( { $and: [ {type : "regular"} , { $or: [ {familystatus : request.params.family }, {location : request.params.location} , {interests : request.params.interests} , {age : {$eq : parseInt( request.params.age)}} ] } ]  } ).toArray((err, users) => {
    if (err) return console.log(err);
    response.setHeader('Content-Type', 'application/json');
    response.send(users);
    
  })
}); 

app.get('/providers/:family/:interests/:location/:age', function(request, response){
  db.collection('users').find( { $and: [ {type : "advertiser"} , { $or: [ {familystatus : request.params.family }, {location : request.params.location} , {interests : request.params.interests} , {age : {$eq : parseInt( request.params.age)}} ] } ]  } ).toArray((err, providers) => {
    if (err) return console.log(err);
    response.setHeader('Content-Type', 'application/json');
    response.send(providers);
    
  })
});

app.put('/update', function(request, response){
  user = request.body;
  db.collection('users').findOneAndUpdate( {username: user.username }, {
    $set: {location: user.location, age: user.age, familystatus : user.familystatus, interests : user.interests}
  }, (err, result) => {
    if (err) return res.send(err);
    response.send('OK');
  })
});

app.put('/addmethod', function(request, response){
  method = request.body.method;
  db.collection('connections').updateMany( { $or: [ { advertiser : usr}, {user : usr} ]  }, {
    $set: { paymentmethod : method}
  }, (err, result) => {
    if (err) return res.send(err);
    response.send('OK');
  })
});



app.delete('/delete/:id', function(request, response){
  db.collection('users').findOneAndDelete({_id: new MongoId(request.params.id)}, (err, result) => {
    if (err) return res.send(500, err)
    response.send('OK');
  })
});

app.delete('/deletetrans/:id', function(request, response){
  db.collection('transactions').findOneAndDelete({_id: new MongoId(request.params.id)}, (err, result) => {
    if (err) return res.send(500, err)
    response.send('OK');
  })
});




MongoClient.connect('mongodb://localhost:27017/webprogramming', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(80, () => console.log('Example app listening on port 3000!'))
})

