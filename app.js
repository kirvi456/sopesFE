var express = require('express');
var app = express();
var str = "";

var mongoose = require('mongoose');
var mongoDB = 'mongodb://34.66.43.182:27017/sopes';
mongoose.connect(mongoDB,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.route('/mensajes').get(function(req, res)

    {
            var cursor = db.collection('mensajes').find();
		cursor.each(function(err, item) {

                if (item != null) {
                    str = str + "    Employee id  " + item.usuario + "</br>";
                }
            });           	
            res.send(str);
        
    });

var server = app.listen(3000, function() {}); 
