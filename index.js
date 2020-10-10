var express = require('express');
var md5 = require('md5');
const app = express();

let users = [];

/**
 * This route allows someone to connect. It creates a user entry and returns a tokens that have to be stored in the client.
 * if the username is already taken, it'll show "Username is already taken"
 * Format:
 * 	 request: POST
 *	 name: auth
 *	 param: username
 * Example: /auth?username=usernamehere
 */
app.get('/auth', function(req, res) {
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