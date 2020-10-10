var express = require('express');
var md5 = require('md5');
const app = express();

let users = [];

app.get('/test', function(req, res) {
    res.send('ceci est un test');
});

let mapSize = {
    x: 50,
    y: 100
}

let map;


function getMap(ms) {
    let map = []

    for (let i = 0; i < ms.x; i++) {
        map.push([])
        for (let j = 0; j < ms.y; j++) {
            map[i][j] = (i === 0 || j === 0 || i === ms.x - 1 || j === ms.y - 1) ? 1 : 0;
        }
    }
    return map;
}

map = getMap(mapSize);

app.post('/maze', function(req, res) {
    res.json(map);
});


var available_points = Array()
var x = 0
var y = 0
var coinIndex;
var coinPosition;
map.forEach(function(line) {
    x = 0
    line.forEach(function(ele) {
        if (ele === 0) {
            available_points.push([x, y])
        }
        x++
    })
    y++
})

function newCoinPosition() {
    coinIndex = Math.round(Math.random() * (available_points.length - 1))
    coinPosition = { 'x': available_points[coinIndex][0], 'y': available_points[coinIndex][1] }
}

newCoinPosition() // définie une nouvelle position de la pièce accessible grâce à coinPosition
app.get('/getCoin', function(req, res) {
    return res.json({ 'coin': coinPosition });
})

app.get('/test', function(req, res) {
	res.send('ceci est un test');
});
/**
 * This route allows someone to connect. It creates a user entry and returns a tokens that have to be stored in the client.
 * if the username is already taken, it'll show "Username is already taken"
 * Format:
 * 	 request: POST
 *	 name: auth
 *	 param: username
 * Example: /auth?username=usernamehere
 */
app.post('/auth', function(req, res) {
	if(req.query.username !== undefined) {
		if(getUserByName(req.query.username) === undefined) {
			let token = md5((Math.random() * 10 + '' + Date.now()).slice(2) + '' + Date.now());
			let user = new User(token, req.query.username);
			users.push(user);
			res.send(token);
		} else
			res.send("Username is already taken");
	} else
		res.send("Invalid request");
});

/**
 * Deletes users that have been stored in users array for at least 1 hour
 */
setInterval(function () {
	let arraypos = 0;
	let newarray = [];
	users.forEach(function(user) {
		if((user.timestamp + 3600) <= Date.now()) {
			delete users[arraypos];
		} else {
			newarray.push(user);
		}
		arraypos++;
	});
	//I need to redefine users array here or it'll keep a memory slot.
	users = newarray;
}, 3600000);


app.listen(3000);

class User {
	constructor(token, username) {
		this.token = token;
		this.username = username;
		this.position = {x : 0, y : 0};
		this.score = 0;
		this.timestamp = Date.now();
	}
}

/**
 Returns a specific User(object) by a specified token.
 if no User is found, returns undefined.
 */
function getUserByToken(token) {
	let val = undefined;
	users.forEach(function(user) {
		if(user.token === token) {
			val = user;
		}
	});
	return val;
}

/**
 Returns a specific User(object) by a specified name.
 if no User is found, returns undefined.
 */
function getUserByName(username) {
	let val = undefined;
	users.forEach(function(user) {
		if(user.username === username) {
			val = user;
		}
	});
	return val;
}

/**
 Returns true if the token is found
 returns false if not.
 */
function check_token(token) {
	return getUserByToken(token) !== undefined;
}

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