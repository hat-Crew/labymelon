var express = require('express');
const app = express();

/*

git add -A
git commit -m 'commentaire de push'
git push

*/

app.post('/move', function(req, res){ // requete post /move?token=thetoken&vx=newx&vy=newy
	if(check_tocken(req.query.token)){
		if(map[req.quer.vx][req.quer.vy] == 1)
			res.send('you can\'t move through walls !');
		else {
			movePlayer(req.query.token, req.query.vx, req.query.vy)
			.then(function(){
				res.send('moved');
			});
		}
	}
	else
		res.send('you need a token to request !');
});

function movePlayer(token, newX, newY) {
	getUserByToken(token).position = { x:newX, y:newY };
}

app.listen(3000);