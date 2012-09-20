var express = require('express'),
    app = express();

//public resources
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

// TODO: Separate control window
// TODO: Word check animation
// TODO: Correct Animation
// TODO: Graphical style
// TODO: Success image
// TODO: 5 wrong attempts animation
// TODO: Full screen

var port = process.env.PORT || 3000;
var host = process.env.HOST || '127.0.0.1';
console.log('listing on http://'+host+':'+port);
app.listen(port);