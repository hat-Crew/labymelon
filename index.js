var express = require('express');
var md5 = require('md5');
const app = express();

let user_tokens = [];

app.get('/test', function(req, res){
	res.send('ceci est un test');
});

app.get('/auth', function(req, res) {
	res.send(generateToken());
});

app.listen(3000);


function generateToken() {
	let token = md5((Math.random() * 10 + '' + Date.now()).slice(2) + '' + Date.now());
	user_tokens.push(token);
	return token;

}