
var express = require('express');
var mongodb = require('mongodb');
var raml2html = require('raml2html');

var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/inf4375');

var jsonschema = require('jsonschema');
var schemas = require('./schemas'); 
var Installation_Schema = require(__dirname+'/../models/installation');
var User_Schema = require(__dirname+'/../models/user');

// Index
router.get('/', function(req, res) {	
    res.render('index');
});
router.get('/userform', function(req, res) {	
    res.render('userform', {title:"Création de dossier d'utilisateur"});
});
//----------------------
// A3 : RAML
//----------------------
router.get('/doc', function(req, res) {
  var config = raml2html.getConfigForTheme();
  var onError = function (err) {
    console.log(err);
    res.sendStatus(500);
  };
  var onSuccess = function(html) {
    res.send(html);
  };
  raml2html.render("public/doc/activites.raml", config).then(onSuccess, onError);
});
// Retourne la liste complète des installations en format json
router.get('/all', function(req, res, next) {
    Installation_Schema.find({}, function (err, insta) {
        if (err) return handleError(err);
		
        res.header("Content-Type", "application/json");
        res.send({"installations" : insta }); 

        //res.render('index', {installations:insta.results, title:'Installations'});
    });
});

//--------------------------------------------------------------------
// A4,A5: Retourne la liste des installations pour un arrondissement
//---------------------------------------------------------------------
router.get('/installations', function(req, res, next) {
    if('arrondissement' in req.query){
        Installation_Schema.find({$or: [{'arrondissement.nom_arr': req.query['arrondissement']},
										{'nom_arr': req.query['arrondissement']}]}, function (err, insta) {
            if (err) return handleError(err);
			
            res.header("Content-Type", "application/json");
            res.send({"installations":insta}); 	
        }); 
    }
	// A6: Retourne les installations par nom
	else if('nom' in req.query){
        Installation_Schema.find({'nom': req.query['nom']}, function (err, insta) {
            if (err) return handleError(err);

            res.header("Content-Type", "application/json");
            res.send({"installations" : insta});
				
        });
    }
	//------------------------------------------------
	// C1,C2,C3 : installations  selon condition 
	//-----------------------------------------------
	else if('condition' in req.query){
        Installation_Schema.find({'condition': req.query['condition']}, function (err, insta) {
            if (err) return handleError(err);
			
			var liste = [];
			for (i in insta){
				var nom_arr_verif = '';
				var cle = '';
				var date_maj = '';
				if(insta[i].nom_arr != undefined) {
					nom_arr_verif = insta[i].nom_arr;
				} else {
					nom_arr_verif = insta[i].arrondissement[0].nom_arr;
					cle = insta[i].arrondissement[0].cle;
					date_maj = insta[i].arrondissement[0].date_maj;
				}
				liste.push({
					nom : insta[i].nom,
					nom_arr : nom_arr_verif,
					cle : cle,
					date_maj : date_maj,
					adresse : insta[i].adresse,
					type : insta[i].type,
					ouvert : insta[i].ouvert,
					deblaye : insta[i].deblaye,
					arrose : insta[i].arrose,
					resurface : insta[i].resurface,
					condition : insta[i].condition,
					proprete : insta[i].proprete,
					gestion : insta[i].gestion,
					equipement :insta[i].equipement			
				});
			}
			function compare(a,b) {
				if (a.nom < b.nom)
					return -1;
				if (a.nom > b.nom)
					return 1;
				return 0;
			}
			// C1 : liste texte en json, en ordre croissant
			liste.sort(compare);
			var liste_obj = {};
			var i = 0;		
			liste.forEach(function(obj){
				liste_obj[i] = obj;
				i++;
			});
			if (!req.query['type']){	
				res.header("Content-Type", "application/json; charset=utf-8");
				res.send({"installations":liste_obj});
				//res.send(liste);
			}
			//C2 : liste en XML 
			if(req.query['type'] == 'XML' || req.query['type'] == 'xml'){
                var js2xmlparser = require("js2xmlparser");
                var xml = js2xmlparser.parse("installations", liste);
                res.header("Content-Type", "application/xml; charset=utf-8");
                res.send(xml); 
            }
			//C3 : liste en CSV
			else if(req.query['type'] == 'CSV' || req.query['type'] == 'csv'){
                 var json2csv = require('json2csv');

                try {
					var fields = ['nom','ouvert','deblaye','condition','nom_arr','cle','date_maj'];
                    var csv = json2csv({data : liste, fields : fields });
                    res.header("Content-Type", "text/csv; charset=utf-8");
                    res.send(csv);
                } catch (err) {
                    console.error(err);
                }
            }
			
		
        });
    }
    else
    {
        res.status(400);
        res.send("Erreur: manque de valeur");
    }
});

//------------------------------------------------
// D1 : jsonschema validation, object modification, tested with Chrome's REST console
//------------------------------------------------
router.put('/all/:id', function(req, res) {
  var result = jsonschema.validate(req.body, schemas.updateGlissade);
  if (result.errors.length > 0) {
    res.status(400).json(result);
  } else {
      if (req.body.date_maj) {
         req.body.date_maj = new Date(req.body.date_maj);
      }
      Installation_Schema.update({_id: new mongodb.ObjectId(req.params.id)}, {$set:req.body}, function(err, result) {
         if (err) {
           res.sendStatus(500);
		 } else if (result.n === 0) {
           res.sendStatus(404);
         } else {
           res.sendStatus(200);
		   console.log(result.n +" document(s) updated");
         }
      });
   }
});
//------------------------------------------------
// D2 : delete object. tested with Chrome's REST console
//------------------------------------------------
router.delete('/all/:id', function(req, res) {
    Installation_Schema.remove({_id: new mongodb.ObjectId(req.params.id)}, function(err, result) {
        if (err) {
           res.sendStatus(500);
        } else if (result.result.n === 0) {
           res.sendStatus(404);
        } else {
           res.sendStatus(200);
		   console.log(result.result.n +" document(s) deleted");
        }
    });
});
//------------------------------------------------
// E1 : createUser profile
//------------------------------------------------
router.post('/users', function(req, res) {
	var result = jsonschema.validate(req.body, schemas.createUser);
	if (result.errors.length > 0) {
		res.status(400).json(result);
    } else {   		
		var u_schema = new User_Schema(req.body);
		u_schema.save(function(err, u_schema) {
			if (err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				res.sendStatus(201);
				console.log("user created");
			}
		});
	}
});	

//-----------------------------------------------
module.exports = router;
