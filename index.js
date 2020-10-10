var express = require('express');
const app = express();

// check si le joueur a avancé d'une case, s'il ne se déplace pas en diagonales et s'il ne va pas sur un mur
function player_can_move(token, vx, vy) {
	let currentPos = getUserByToken(token).position;
	if(map[currentPos.x+vx][currentPos.y+vy] == 0) { // check si on est sur un mur ou pas
		if(currentPos.x + vx == currentPos.x+1 || currentPos.x + vx == currentPos.x-1 || currentPos.x + vx == currentPos.x) {
			if(currentPos.y + vy == currentPos.y+1 || currentPos.y + vy == currentPos.y-1 || currentPos.y + vy == currentPos.y) {
				if(vx+vy < 2 && vx+vy > -2) // évite de se déplacer en diagonales
					return true;
			}
		}
	}
	return false;
}


// requete post /move?token=thetoken&vx=vx&vy=vy
app.post('/move', function(req, res){
	if(check_token(req.query.token)){
		if(player_can_move(req.query.token, parseInt(req.query.vx), parseInt(req.query.vy))) {
				getUserByToken(req.query.token).position.x += parseInt(req.query.vx); // on update la position du joueur
				getUserByToken(req.query.token).position.y += parseInt(req.query.vy);
				res.send('ok');
		}
		else {
				res.send('you can\'t move');
		}
	}
	else
		res.send('you need to specify a valid token');
});

app.listen(3000);