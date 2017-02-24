//store required modules
var express = require('express');
var bodyParser = require('body-parser');

//make instanse of the express app
var app = express();

//use bodyParser 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//serve static resources in prod environment
app.use('/vendor', express.static(__dirname + '/node_modules'));
app.use('/assets', express.static(__dirname + '/prod/assets'));
app.use('/partials', express.static(__dirname + '/prod/partials'));

//serve index page in prod environment
//IMPORTANT: no route should be defined after
app.get('/*', function(req, res, next){
	res.sendFile(__dirname + '/prod/index.html');
});

app.listen(4000, function(){
	console.log('serving at http://localhost:4000/');
})
