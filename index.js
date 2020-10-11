var express = require('express');
const cors = require('cors');
const app = express();


app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.options('*', cors());
app.listen(3000);

var md5 = require('md5');
let users = [];



let mapSize = {
    x: 50,
    y: 100
}
let ms = {
    x: 49,
    y: 101
};

let map;
let nbOfPaths;
let nbNewPaths;
let unusedPath;
let path;
let checkFor;
let found;



function generateRawMap(map) {
    for (let i = 0; i < ms.x; i++) {
        map.push([])
        for (let j = 0; j < ms.y; j++) {
            map[i][j] = (i === 0 || j === 0 || i === ms.x || j === ms.y || !(i % 4) || !(j % 4)) ? 1 : 0; // sets the borders as wall, and creates a grid in the middle every 4 blocks
        }
    }
    return map;
};

function generatePath(map) {
    for (k = 1; k < ms.x - 1; k++) {
        for (l = 1; l < ms.y - 1; l++) {
            if (!(k % 4) && !(l % 4)) {

                unusedPath = [0, 1, 2, 3];
                nbOfPaths = 0;

                if (map[k - 1][l] == 0 || k == 1) { //check if paths already exists, and if yes, which
                    nbOfPaths += 1;
                    unusedPath.slice(0, 1);
                }
                if (map[k][l - 1] == 0 || l == 1) {
                    nbOfPaths += 1;
                    unusedPath.slice(1, 1);
                }
                if (map[k + 1][l] == 0 || k + 1 == ms.x - 1) {
                    nbOfPaths += 1;
                    unusedPath.slice(2, 1);
                }
                if (map[k][l + 1] == 0 || l + 1 == ms.y - 1) {
                    nbOfPaths += 1;
                    unusedPath.slice(3, 1);
                }

                switch (nbOfPaths) { //depending on the numbers of already existent paths, create a certain amount of new ones
                    case 0:
                        nbNewPaths = 2 + Math.floor(Math.random() * 3);
                        break; // (2 - 4 paths)
                    case 1:
                        nbNewPaths = 1 + Math.floor(Math.random() * 3);
                        break; // (1 - 3 paths)
                    case 2:
                        nbNewPaths = Math.floor(Math.random() * 2);
                        break; // (0 - 1 path)
                    case 3:
                        nbNewPaths = Math.floor(Math.random() * 2);
                        break; // (0 - 1 path)
                    case 4:
                        nbNewPaths = 0;
                        break;
                }

                for (let m = 0; m < nbNewPaths; m++) { // For each new paths 
                    let index = Math.floor(Math.random() * (4 - nbOfPaths)); // get a random direction
                    path = unusedPath[index]; // find the direction linked to the random index

                    switch (path) { //remove a wall in the corresponding direction
                        case 0:
                            map[k - 1][l] = 0;
                            break; //top
                        case 1:
                            map[k][l - 1] = 0;
                            break; //left
                        case 2:
                            map[k + 1][l] = 0;
                            break; //bottom
                        case 3:
                            map[k][l + 1] = 0;
                            break; //right
                    }
                }
            }
        }
    }
    return map;
};

function cleanMap(map) {

    for (i = 2; i < ms.x - 1; i += 2) { //cycling through all slots
        for (j = 2; j < ms.y - 1; j += 2) {
            checkFor = (map[i][j]); // we will look for same element as the current element in its surrounding
            found = false;

            for (k = -1; k <= 1 && !found; k++) {
                for (l = -1; l <= 1 && !found; l++) {
                    if (!(k == 0 && l == 0) && map[i + k][j + l] == checkFor) { //if the same type of element as the middle one, we will set the value found as true
                        found = true; //when it is found, we will stop cycling through the surroundings
                    }
                }
            }

            if (!found) { //if no element has been found
                map[i][j] = (map[i][j]) ? 0 : 1; //invert the middle element, to match its surroundings
            }

            if ((i - 2) % 4 == 0 && (j - 2) % 4 == 0) { //Ever 4 blocks
                nbOfOpenings = 0; //here we will count the number of opening a room has

                bufCord = { //this will be used to close an opening if needed
                    x: 0,
                    y: 0
                }

                for (k = 0; k < 5 && nbOfOpenings < 2; k++) { //we cycle through the room, we only want to keep rooms with at least 2 openings, to avoid closed areas
                    for (l = 0; l < 5 && nbOfOpenings < 2; l++) {

                        if (k == 0 || k == 4 || l == 0 || l == 4) { // we only want to test the walls of the room
                            if (map[i + k - 2][j + l - 2] == 0) { // if the room is opened
                                nbOfOpenings++ // add one opening
                                bufCord.x = i + k - 2; //save the coords of it to close it if needed
                                bufCord.y = j + l - 2;
                            }
                        }
                    }
                }

                if (nbOfOpenings < 2) { // if theres it only 1 or no openings
                    for (k = 1; k <= 3; k++) {
                        for (l = 1; l <= 3; l++) {
                            map[i + k - 2][j + l - 2] = 1; //we fill the room

                        }
                    }
                    map[bufCord.x][bufCord.y] = 1; //we close the opening if there is one
                }
            }
        }
    }

    return map;
};


function generateRandomMap() {
    map = []; //empty map
    map = generateRawMap(map); //this will generate a map with all walls filled
    map = generatePath(map); //this will generate all paths
    map = cleanMap(map); //this will clean singular elements
    return map;
};

map = generateRandomMap();
app.post('/maze', function(req, res) {
    if (check_token(req.body.token)) {
        res.json(map);
    } else
        res.json('you need to specify a valid token');
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

newCoinPosition() // définie une nouvelle position de la pièce accessible grâce à coinPosition.x et coinPosition.y
app.post('/getCoin', function(req, res) {
    if (check_token(req.body.token)) {
        return res.json({ 'coin': coinPosition });
    } else
        res.json('you need to specify a valid token');
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
    if (req.body.username != undefined) {
        if (getUserByName(req.body.username) == undefined) {
            let token = md5((Math.random() * 10 + '' + Date.now()).slice(2) + '' + Date.now());
            let user = new User(token, req.body.username);
            users.push(user);
            res.json(token);
        } else
            res.json("Username is already taken");
    } else
        res.json("Invalid request");
});

/**
 * Deletes users that have been stored in users array for at least 1 hour
 */
setInterval(function() {
    let arraypos = 0;
    let newarray = [];
    users.forEach(function(user) {
        if ((user.timestamp + 3600) <= Date.now()) {
            delete users[arraypos];
        } else {
            newarray.push(user);
        }
        arraypos++;
    });
    //I need to redefine users array here or it'll keep a memory slot.
    users = newarray;
}, 3600000);



class User {
    constructor(token, username) {
        this.token = token;
        this.username = username;
        this.position = { x: 1, y: 1 };
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
function getUserByName(username) {
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
function check_token(token) {
    return getUserByToken(token) !== undefined;
}

// check si le joueur a avancé d'une case, s'il ne se déplace pas en diagonales et s'il ne va pas sur un mur
function player_can_move(token, vx, vy) {
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
app.post('/move', function(req, res) {
    if (check_token(req.body.token)) {
        if (getUserByToken(req.body.token).timestamp <= Date.now() - 90 && player_can_move(req.body.token, parseInt(req.body.vx), parseInt(req.body.vy))) {
            getUserByToken(req.body.token).timestamp = Date.now();
            getUserByToken(req.body.token).position.x += parseInt(req.body.vx); // on update la position du joueur
            getUserByToken(req.body.token).position.y += parseInt(req.body.vy);
            if (getUserByToken(req.body.token).position.x == coinPosition.x && getUserByToken(req.body.token).position.y == coinPosition.y)
                getCoin(getUserByToken(req.body.token));
            res.json('moved');
        } else {
            res.json('you can\'t move');
        }
    } else
        res.json('you need to specify a valid token');
});

// requete post /all?token=thetoken
// return : piece position and all players positions
app.post('/all', function(req, res) {
    if (check_token(req.body.token)) {
        // let allPlayers = {};
        let allPlayers = [];

        users.forEach(function(user) {
            // allPlayers[user.username] = { position: user.position, score: user.score }
            allPlayers.push([user.username, user.position, user.score]);
        });

        res.json({ coin: coinPosition, players: allPlayers });
    } else
        res.json('you need to specify a valid token');
});

function getCoin(winner) {
    winner.score++
        newCoinPosition()
}


//kick un joueur s'il n'a pas joué durant les 120 dernières secondes
setInterval(function() {
    users.forEach(function(user, user_index, user_object) {
        if (user.timestamp <= Date.now() - 1000)
            user_object.splice(user_index, 1);
    });
}, 100)