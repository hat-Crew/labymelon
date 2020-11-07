module.exports = function() {
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

    function getCoin(winner) {
        winner.score++
        newCoinPosition()
    }
}