module.exports = function() {
    var mapSize = {
        x: 50,
        y: 100
    }
    var ms = {
        x: 49,
        y: 101
    };
    
    var nbOfPaths;
    var nbNewPaths;
    var unusedPath;
    var path;
    var checkFor;
    var found;
    
    
    
    this.generateRawMap = function(map) {
        for (let i = 0; i < ms.x; i++) {
            map.push([])
            for (let j = 0; j < ms.y; j++) {
                map[i][j] = (i === 0 || j === 0 || i === ms.x || j === ms.y || !(i % 4) || !(j % 4)) ? 1 : 0; // sets the borders as wall, and creates a grid in the middle every 4 blocks
            }
        }
        return map;
    };
    
    this.generatePath = function(map) {
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
    
    this.cleanMap = function(map) {
    
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
    
    
    this.generateRandomMap = function() {
        map = []; //empty map
        map = generateRawMap(map); //this will generate a map with all walls filled
        map = generatePath(map); //this will generate all paths
        map = cleanMap(map); //this will clean singular elements
        return map;
    };
    
    
    this.maze = function(req, res) {
        let token = req[1].split('=')[1];
        if (check_token(token)) {
            res.send('map: '+JSON.stringify(map));
        } else
        res.send('error: you need to specify a valid token');
    }
    map = generateRandomMap();
    
}