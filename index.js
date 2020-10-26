var md5 = require('md5');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 25565 });


/* 
How to make a ws request (client side) :

1) connect to the ws server : var ws = new WebSocket("ws://146.59.146.53:25565");
2) listen for server messages : ws.onmessage = function (event) { console.log(event.data); };
3) send ws request : ws.send('auth username=test'); (this example request trigger l.19 on this file)
*/
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        switch (message.split(' ')[0]) {
            
            // requete ws : auth username=value
            case 'auth':
                if(message.split(' ').length == 2)
                    auth(message.split(' '), ws);
            break;

            // requete ws : maze token=value
            case 'maze':
                if(message.split(' ').length == 2)
                    maze(message.split(' '), ws);
            break;

            //requete ws : move token=value vx=value vy=value
            case 'move':
                if(message.split(' ').length == 4)
                    move(message.split(' '), ws);
            break;
            
            //requete ws : all token=value
            case 'all':
                if(message.split(' ').length == 2)
                    all(message.split(' '), ws);
            break;
        }
    });
});

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

function maze(req, res) {
    let token = req[1].split('=')[1];
    if (check_token(token)) {
        res.send('map: '+JSON.stringify(map));
    } else
        res.send('error: you need to specify a valid token');
}



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

/**
 * This route allows someone to connect. It creates a user entry and returns a tokens that have to be stored in the client.
 * if the username is already taken, it'll show "Username is already taken"
 * Format:
 * 	 request: POST
 *	 name: auth
 *	 param: username
 * Example: /auth?username=usernamehere
 */
function auth(req, res) {
    if(req[1].includes('=')){
        let username = req[1].split('=')[1];
        if (username != undefined) {
            if (getUserByName(username) == undefined) {
                let token = md5((Math.random() * 10 + '' + Date.now()).slice(2) + '' + Date.now());
                let user = new User(token, username);
                users.push(user);
                res.send('token: '+token);
            } else
                res.send("error: Username is already taken");
        } else
            res.send("error: Invalid request");
    }
}

class User {
    constructor(token, username) {
        this.token = token;
        this.username = username;
        this.position = { x: available_points[0][0], y: available_points[0][1] };
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
function move(req, res) {
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

// requete post /all?token=thetoken
// return : piece position and all players positions
function all(req, res) {
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

function getCoin(winner) {
    winner.score++
        newCoinPosition()
}


// //kick un joueur s'il n'a pas joué durant les 120 dernières secondes
// setInterval(function() {
//     users.forEach(function(user, user_index, user_object) {
//         if (user.timestamp <= Date.now() - 10000)
//             user_object.splice(user_index, 1);
//     });
// }, 100)