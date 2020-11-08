var md5 = require('md5');

module.exports = function() {

    users = [];

    /**
     * This route allows someone to connect. It creates a user entry and returns a tokens that have to be stored in the client.
     * if the username is already taken, it'll show "Username is already taken"
     * Format:
     * 	 request: POST
     *	 name: auth
    *	 param: username
    * Example: /auth?username=usernamehere
    */
    this.auth = function(req, res) {
        if(req[1].includes('=')){
            let username = req[1].split('=')[1];
            if (username != undefined && username != "") {
                if (getUserByName(username) == undefined) {
                    let token = md5((Math.random() * 10 + '' + Date.now()).slice(2) + '' + Date.now());
                    let user = new User(token, username);
                    users.push(user);
                    res.send('token: '+token);
                } else
                    res.send("error: Username is already taken !");
            } else
                res.send("error: Username cannot be empty !");
        }
        console.log(users);
    }

    class User {
        constructor(token, username) {
            this.token = token;
            this.username = username;
            this.position = { x: available_points[0][0], y: available_points[0][0] };
            this.score = 0;
            this.timestamp = Date.now();
        }
    }

    /**
     Returns a specific User(object) by a specified token.
    if no User is found, returns undefined.
    */
    this.getUserByToken = function(token) {
        let val = undefined;
        users.forEach(function(user) {
            if (user.token === token) {
                val = user;
            }
        });
        return val;
    }

    /**
     Returns a specific User(object) by a specified name.
    if no User is found, returns undefined.
    */
    this.getUserByName = function(username) {
        let val = undefined;
        users.forEach(function(user) {
            if (user.username === username) {
                val = user;
            }
        });
        return val;
    }

    /**
     Returns true if the token is found
    returns false if not.
    */
    this.check_token = function(token) {
        return getUserByToken(token) !== undefined;
    }
}