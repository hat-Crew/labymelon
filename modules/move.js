module.exports = function() {
    // check si le joueur a avancé d'une case, s'il ne se déplace pas en diagonales et s'il ne va pas sur un mur
    this.player_can_move = function(token, vx, vy) {
        let currentPos = getUserByToken(token).position;
        if (map[currentPos.y + vy][currentPos.x + vx] == 0) { // check si on est sur un mur ou pas
            if (currentPos.x + vx == currentPos.x + 1 || currentPos.x + vx == currentPos.x - 1 || currentPos.x + vx == currentPos.x) {
                if (currentPos.y + vy == currentPos.y + 1 || currentPos.y + vy == currentPos.y - 1 || currentPos.y + vy == currentPos.y) {
                    if (vx + vy < 2 && vx + vy > -2) // évite de se déplacer en diagonales
                        return true;
                }
            }
        }
        return false;
    }


    // requete post /move?token=thetoken&vx=vx&vy=vy
    this.move = function(req, res) {
        if(req[1].includes('=') && req[2].includes('=') && req[3].includes('=')) {
            token = req[1].split('=')[1];
            vx = req[2].split('=')[1];
            vy = req[3].split('=')[1];
        
            if (check_token(token)) {
                if (getUserByToken(token).timestamp <= Date.now() - 90 && player_can_move(token, parseInt(vx), parseInt(vy))) {
                    getUserByToken(token).timestamp = Date.now();
                    getUserByToken(token).position.x += parseInt(vx); // on update la position du joueur
                    getUserByToken(token).position.y += parseInt(vy);
                    if (getUserByToken(token).position.x == coinPosition.x && getUserByToken(token).position.y == coinPosition.y)
                        getCoin(getUserByToken(token));
                    res.send('moved');
                } else {
                    res.send('error: you can\'t move');
                }
            } else
                res.send('error: you need to specify a valid token');
        }
    }
}