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

app.listen(3000);