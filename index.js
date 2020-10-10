var express = require('express');
const app = express();

let mapSize = {
    x: 50,
    y: 100
}

let map;

async function getMap(ms){
    let map = []

    for (let i = 0; i < ms.x; i++){
        map.push([])
        for (let j = 0; j < ms.y; j++){
            map[i][j] = (i === 0 || j === 0 || i === ms.x - 1 || j === ms.y - 1) ? 1 : 0;
        }
    }
    return map;
}

map = getMat(mapSize);

app.post('/maze', function(req, res){
	res.json(map);
});

app.listen(3000);