var express = require('express');
const app = express();



var matrice = [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1]
]
var available_points = Array()
var x = 0
var y = 0
var coinIndex;
var coinPosition;
matrice.forEach(function(line) {
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

app.listen(3000);