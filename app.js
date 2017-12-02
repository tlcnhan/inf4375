var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//-----------------------------------------------------------------------
// A1
//-----------------------------------------------------------------------
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/inf4375");

// Connection à la base de donnée
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Mongoose connected");
});

// Schemas
var Installation_Schema = require(__dirname+'/models/installation');
var User_Schema = require(__dirname+'/models/user');

// Flush la base de donnée au démarrage
Installation_Schema.remove({}, function(err) { 
   console.log('Installations list cleaned'); 
});
User_Schema.remove({}, function(err) { 
   console.log('Users list cleaned'); 
});

//parsing & save
var url1 = "http://donnees.ville.montreal.qc.ca/dataset/4604afb7-a7c4-4626-a3cae136158133f2/resource/cbdca706-569e-4b4a-805d-9af73af03b14/download/piscines.csv"
var url2 = "http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml"
var url3 = "http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_GLISSADE.xml"
var request = require('request');
var parseString = require('xml2js').parseString;
var http = require('http');
xmlToJson(url2, function(err, data) {
  if (err) {
    return console.err(err);
  } 
  var patinoires_json = data;
	
  for(var i in patinoires_json.patinoires.patinoire){
        p = patinoires_json.patinoires.patinoire[i];	
        var p_schema = new Installation_Schema(p);

        p_schema.save(function (err, p_schema) {
            if (err) return console.error(err);
        });
  } 
});

xmlToJson(url3, function(err, data) {
  if (err) {
    return console.err(err);
  } 
  var glissades_json = data;
	
  for(var i in glissades_json.glissades.glissade){
        g = glissades_json.glissades.glissade[i];
        var g_schema = new Installation_Schema(g);

        g_schema.save(function (err, g_schema) {
            if (err) return console.error(err);
        });
    } 
});
//---------------------------------------------------------
// function XML to JSON
function xmlToJson(url, callback) {
  var req = http.get(url, function(res) {
    var xml = '';
  
    res.on('data', function(chunk) {
      xml += chunk;
    });
    res.on('error', function(e) {
      callback(e, null);
    }); 
    res.on('timeout', function(e) {
      callback(e, null);
    }); 
    res.on('end', function() {
      parseString(xml, function(err, result) {
        callback(null, result);
      });
    });
  });
} 

// CSV to JSON
var Converter = require("csvtojson").Converter;
var converter = new Converter({});
//var fs = require('fs');
//var csv_file = fs.createWriteStream("csv_file.csv");
//var request_csv = http.get(url1, function(response) {
//  response.pipe(csv_file);
//});

converter.fromFile("piscines.csv",function(err,result){
    if(err){
        console.log("An Error Has Occured");
        console.log(err);  
    } 
	var piscines_json = result;
	
	for(var i in piscines_json){
        pi = piscines_json[i];
		pi.id_uev = pi.ID_UEV;
		pi.nom = pi.NOM;
		pi.nom_arr = pi.ARRONDISSE;
		pi.adresse = pi.ADRESSE;
		pi.type = pi.TYPE;
		pi.propriete = pi.PROPRIETE;
		pi.gestion = pi.GESTION;
		pi.point_x = pi.POINT_X;
		pi.point_y = pi.POINT_Y;
		pi.equipement = pi.EQUIPEME;
		pi.longitude = pi.LONG;
		pi.latitude = pi.LAT;
		
		delete pi.ID_UEV;
		delete pi.NOM;
		delete pi.ARRONDISSE;
		delete pi.ADRESSE;
		delete pi.TYPE;
		delete pi.PROPRIETE;
		delete pi.GESTION;
		delete pi.POINT_X;
		delete pi.POINT_Y;
		delete pi.EQUIPEME;
		delete pi.LONG;
		delete pi.LAT;
		
        var pi_schema = new Installation_Schema(pi);

        pi_schema.save(function (err, pi_schema) {
            if (err) return console.error(err);
        });
	}
});
//---------------------------------------------------
// A2
//---------------------------------------------------
// Tous les minuit, le dataset sera flushé et stocké à nouveau dans la base de donnée
var scheduler = require('node-schedule');
var rule = new scheduler.RecurrenceRule();
	rule.hour = 00;
	rule.minute = 00;
var dailyJob = scheduler.scheduleJob(rule, function(){
	Installation_Schema.remove({}, function(err) { 
		console.log('Liste des Installations cleaned!'); 
	});
	/*/refresh CVS	????
	converter.fromFile("piscines.csv",function(err,result){
		if(err){
			console.log("An Error Has Occured");
			console.log(err);  
		} 
		var piscines_json = result;
	
		for(var i in piscines_json){
			
			pi = piscines_json[i];
			pi.id_uev = pi.ID_UEV;
			pi.nom = pi.NOM;
			pi.nom_arr = pi.ARRONDISSE;
			pi.adresse = pi.ADRESSE;
			pi.type = pi.TYPE;
			pi.propriete = pi.PROPRIETE;
			pi.gestion = pi.GESTION;
			pi.point_x = pi.POINT_X;
			pi.point_y = pi.POINT_Y;
			pi.equipement = pi.EQUIPEME;
			pi.longitude = pi.LONG;
			pi.latitude = pi.LAT;
		
			delete pi.ID_UEV;
			delete pi.NOM;
			delete pi.ARRONDISSE;
			delete pi.ADRESSE;
			delete pi.TYPE;
			delete pi.PROPRIETE;
			delete pi.GESTION;
			delete pi.POINT_X;
			delete pi.POINT_Y;
			delete pi.EQUIPEME;
			delete pi.LONG;
			delete pi.LAT;
			
			var pi_schema = new Installation_Schema(pi);

			pi_schema.save(function (err, pi_schema) {
				if (err) return console.error(err);
			});
		}
	});*/
    //refresh XML
	xmlToJson(url2, function(err, data) {
		if (err) {
			return console.err(err);
		}
		var patinoires_json = data;
	
		for(var i in patinoires_json.patinoires.patinoire){
			p = patinoires_json.patinoires.patinoire[i];
			var p_schema = new Installation_Schema(p);

			p_schema.save(function (err, p_schema) {
				if (err) return console.error(err);
			});
		} 
	});

	xmlToJson(url3, function(err, data) {
		if (err) {
    		return console.err(err);
		} 
		var glissades_json = data;
	
		for(var i in glissades_json.glissades.glissade){
			g = glissades_json.glissades.glissade[i];
			var g_schema = new Installation_Schema(g);

			g_schema.save(function (err, g_schema) {
				if (err) return console.error(err);
			});
		} 
	});
	
	console.log("liste raffraichie!");
    
});

    	
//---------------------------------------------------
module.exports = app;
