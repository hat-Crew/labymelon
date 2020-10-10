var express = require('express');
const app = express();

/*

git add -A
git commit -m 'commentaire de push'
git push

*/

app.get('/test', function(req, res){
	res.send('ceci est un test');
});

app.listen(3000);