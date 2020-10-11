var express = require('express');
const app = express();

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

function generateEmptyMap(map){
    for (let i = 0; i < ms.x; i++){
        map.push([])
        for (let j = 0; j < ms.y; j++){
            map[i][j] = (i === 0 || j === 0 || i === ms.x || j === ms.y || !(i % 4) || !(j % 4)) ? 1 : 0;
        }
    }
    return map;
};

function generatePath(map){
    for (k = 1; k < ms.x - 1; k++){
        for (l = 1; l < ms.y - 1; l++){
            if (!(k % 4) && !(l % 4)){

                unusedPath = [0, 1, 2, 3];
                nbOfPaths = 0;

                if (map[k - 1][l] == 0 || k == 1){ //check if paths already exists, and if yes, which
                    nbOfPaths += 1;
                    unusedPath.slice(0, 1);
                }
                if (map[k][l - 1] == 0 || l == 1){
                    nbOfPaths += 1;
                    unusedPath.slice(1, 1);
                }
                if (map[k + 1][l] == 0 || k + 1 == ms.x - 1){
                    nbOfPaths += 1;
                    unusedPath.slice(2, 1);
                }
                if (map[k][l + 1] == 0 || l + 1 == ms.y - 1){
                    nbOfPaths += 1;
                    unusedPath.slice(3, 1);
                }

                switch(nbOfPaths){ //depending on the numbers of already existent paths, create a certain amount of new ones
                    case 0: nbNewPaths = 2 + Math.floor(Math.random() * 3); break;
                    case 1: nbNewPaths = 1 + Math.floor(Math.random() * 3); break;
                    case 2: nbNewPaths = Math.floor(Math.random() * 2); break;
                    case 3: nbNewPaths = Math.floor(Math.random() * 2); break;
                    case 4: nbNewPaths = 0; break;
                }

                for(let m = 0; m < nbNewPaths; m++){ // For each new paths 
                    let index = Math.floor(Math.random() * (4 - nbOfPaths)); // get a random direction
                    path = unusedPath[index]; // find the direction linked to the random index
                    
                    switch(path){ //remove a wall in the corresponding direction
                        case 0: map[k - 1][l] = 0; break;
                        case 1: map[k][l - 1] = 0; break;
                        case 2: map[k + 1][l] = 0; break;
                        case 3: map[k][l + 1] = 0; break;
                    }
                }
            }
        }
    }
    return map;
}

function cleanMap(map){

    for (i = 1; i < ms.x - 1; i++){
        for (j = 1; j < ms.y - 1; j++){
            checkFor = (map[i][j]);
            found = false;

            found = (map[i - 1][j] == checkFor) ? true : found;
            found = (map[i - 1][j + 1] == checkFor) ? true : found;
            found = (map[i - 1][j - 1] == checkFor) ? true : found;

            found = (map[i + 1][j] == checkFor) ? true : found;
            found = (map[i + 1][j - 1] == checkFor) ? true : found;
            found = (map[i + 1][j + 1] == checkFor) ? true : found;
            
            found = (map[i][j - 1] == checkFor) ? true : found;
            found = (map[i][j + 1] == checkFor) ? true : found;

            if (!found){
                map[i][j] = (map[i][j]) ? 0 : 1;
            }
        }
    }
    return map;
}

function generateRandomMap(){
    map = [];
    map = generateEmptyMap(map);
    map = generatePath(map)
    map = cleanMap(map);
    return map;
};

map = generateRandomMap();

app.post('/map', function(req, res){
	res.json(map);
});

app.listen(3000);