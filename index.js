var express = require('express');
const app = express();



app.get('/test', function(req, res){
	res.send('ceci est un test');
});

app.get('/auth', function(req, res) {
	res.send('auth');
});

app.listen(3000);