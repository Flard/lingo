var express = require('express'),
    app = express();

//public resources
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

// TODO: Separate control window
// TODO: Graphical style
// TODO: Success image
// TODO: Full screen

// TODO: socket.io commands

/* Commands:
 * - resetWord
 * - setWord('WORD')
 * - nextWord()
 * - resetLine
 */

var port = process.env.PORT || 3000;
var host = process.env.HOST || '127.0.0.1';
console.log('listing on http://'+host+':'+port);
app.listen(port);