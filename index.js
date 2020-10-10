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
coinIndex = Math.round(Math.random() * available_points.length)

app.get('/newCoin', function(req, res) {
    coinIndex = Math.round(Math.random() * (available_points.length - 1))
    return res.json({ 'coin': { 'x': available_points[coinIndex][0], 'y': available_points[coinIndex][1] } });
})
app.get('/getCoin', function(req, res) {
    return res.json({ 'coin': { 'index': available_points.length, 'x': available_points[coinIndex][0], 'y': available_points[coinIndex][1] } });
})

app.get('/test', function(req, res) {
    res.send('ceci est un test');
});

app.listen(3000);