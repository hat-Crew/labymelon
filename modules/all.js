module.exports = function() {
    // requete post /all?token=thetoken
    // return : piece position and all players positions
    this.all = function(req, res) {
        if(req[1].includes('=')) { 
            token = req[1].split('=')[1];
            if (check_token(token)) {
                // let allPlayers = {};
                let allPlayers = [];
        
                users.forEach(function(user) {
                    // allPlayers[user.username] = { position: user.position, score: user.score }
                    allPlayers.push([user.username, user.position, user.score]);
                });
        
                res.send('players: '+JSON.stringify({ coin: coinPosition, players: allPlayers }));
            } else
                res.send('error: you need to specify a valid token');
        }
    }
}