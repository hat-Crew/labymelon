var md5 = require('md5');

require('./modules/auth.js');
require('./modules/maze.js');
require('./modules/coin.js');
require('./modules/move.js');
require('./modules/all.js');

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


// //kick un joueur s'il n'a pas joué durant les 120 dernières secondes
// setInterval(function() {
//     users.forEach(function(user, user_index, user_object) {
//         if (user.timestamp <= Date.now() - 10000)
//             user_object.splice(user_index, 1);
//     });
// }, 100)