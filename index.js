var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 25565 });

require('./modules/globalVariables.js')();

require('./modules/auth.js')();
require('./modules/maze.js')();
require('./modules/move.js')();
require('./modules/all.js')();
require('./modules/coin.js')();

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
                else
                    ws.send('error: auth needs 1 argument !');
            break;

            // requete ws : maze token=value
            case 'maze':
                if(message.split(' ').length == 2)
                    maze(message.split(' '), ws);
                else
                    ws.send('error: maze needs 1 argument !');
            break;

            //requete ws : move token=value vx=value vy=value
            case 'move':
                if(message.split(' ').length == 4)
                    move(message.split(' '), ws);
                else
                    ws.send('error: move needs 3 arguments !');
            break;
            
            //requete ws : all token=value
            case 'all':
                if(message.split(' ').length == 2)
                    all(message.split(' '), ws);
                else
                    ws.send('error: all needs 1 argument !');
            break;

            default:
                ws.send('error: command not found !');
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