module.exports = function() {

    this.newCoinPosition = function() {
        coinIndex = Math.round(Math.random() * (available_points.length - 1))
        coinPosition = { 'x': available_points[coinIndex][0], 'y': available_points[coinIndex][1] }
    }
    
    this.getCoin = function(winner) {
        winner.score++
        newCoinPosition()
    }
    
    // console.log(map);
    available_points = [];

    map.forEach(function(line) {
        x = 0;
        y = 0;
        line.forEach(function(ele) {
            // console.log(ele)
            if (ele === 0) {
                available_points.push([x, y]);
            }
            x++;
        });
        y++;
    });

    newCoinPosition();
}