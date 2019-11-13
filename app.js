
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var mongoose = require('mongoose');
var mongoDB = 'mongodb://34.68.30.68:27017/sopes';
mongoose.connect(mongoDB,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(5000, function() {}); 

app.route('/informacion').get(function(req, res){
	var jsonvar = '{';
	let total_usuarios = db.collection('mensajes').aggregate([{$group: {_id: "$usuario"}}]).toArray(function(err, resultado){
		if(err) throw res.status(400).send("No se pudo conectar a la base de datos.");
		jsonvar += '"total_usuarios": ' + resultado.length + ",";
		console.log(jsonvar);
	});     
    let usuario_mayor = db.collection('mensajes').aggregate([{$group: {_id: "$usuario", count: {$sum: 1}}}]).sort({count: -1}).toArray(function(err, resultado){
		if(err) throw res.status(400).send("No se pudo conectar a la base de datos.");
		jsonvar += '"usuario_mayor": ' + '"' + resultado[0]['usuario'] + '"';
		console.log(jsonvar);
	});             
	jsonvar += '}';
	res.send(jsonvar);
});

app.route('/buscarUsuario').get(function(req, res){
	var usuarioABuscar = req.body.usuario;
        var cursor = db.collection('mensajes').find({usuario: usuarioABuscar }).limit(3).toArray(function(err, resultado){
                if(err) throw res.status(400).send("No se pudo conectar a la base de datos.");;
                res.json(resultado);
        });             
    });

app.route('/buscarCategoria').get(function(req, res){
        var categoriaABuscar = req.body.categoria;
        var cursor = db.collection('mensajes').find({categoria: categoriaABuscar }).limit(3).toArray(function(err, resultado){
                if(err) throw res.status(400).send("No se pudo conectar a la base de datos.");;
                res.json(resultado);
        });             
    });

app.route('/mensajes').get(function(req, res){
        var cursor = db.collection('mensajes').find().sort({datetime : -1}).toArray(function(err, resultado){
		if(err) throw res.status(400).send("unable to save to database");;
		res.json(resultado);

	});          	
    });

app.route('/mensajes').post(function(req, res)
    {       
	var usuario = req.query.usuario;
	var nombre = req.query.nombre;
	var txt = req.query.txt;
	var categoriaAux = txt.match(/#\w*/);
	var categoria = categoriaAux.toString().replace("#","");
	var datetime = new Date();
	var str = "{" +
			'"usuario": "' + usuario + '",' +
			'"nombre": "' + nombre + '",' +
			'"txt": "' + txt + '",' +
			'"categoria": "' + categoria + '",' +
			'"datetime": "' + datetime + '"' +
		'}';
	var jsonAux = JSON.parse(str);       
	db.collection("mensajes").insert(jsonAux);	    
       	res.send("respuesta");
	});

 
