var express = require('express');
const app = express();

// requete post /move?token=thetoken&vx=newx&vy=newy
app.post('/move', function(req, res){
	if(check_token(req.query.token)){
		if(map[req.quer.vx][req.quer.vy] == 1)
			res.send('you can\'t move through walls');
		else {
			if(movePlayer(req.query.token, req.query.vx, req.query.vy)) {
				getUserByToken(token).position = { x:newX, y:newY }; // on update la position du joueur
				res.send('successfully moved');
			}
			else {
				res.send('you can\'t teleport');
			}
			
		}
	}
	else
		res.send('you need to specify a valid token');
});

// check si le joueur a avancé d'une case et pas plus
function movePlayer(token, newX, newY) {
	let currentPos = getUserByToken(token).position;
	if(currentPos.x + newX == currentPos.x+1 || currentPos.x + newX == currentPos.x-1 || currentPos.x + newX == currentPos.x) {
		if(currentPos.y + newY == currentPos.y+1 || currentPos.y + newY == currentPos.y-1 || currentPos.y + newY == currentPos.y)
			return false;
	}
	return true;
}

app.listen(3000);