
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
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Projet de session INF4375' });
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
    });
});

//--------------------------------------------------------------------
// A4,A5: Retourne la liste des installations pour un arrondissement
//---------------------------------------------------------------------
router.get('/installations', function(req, res, next) {
    if('arrondissement' in req.query)
    {
        Installation_Schema.find({$or: [{'arrondissement.nom_arr': req.query['arrondissement']},
										{'nom_arr': req.query['arrondissement']}]}, function (err, insta) {
            if (err) return handleError(err);
			//res.json(insta);
            res.header("Content-Type", "application/json");
            res.send({"installations" : insta }); 
			//res.render("index");
        }); 
    }
	// A6: Retourne les installations par nom
	else if('nom' in req.query)
    {
        Installation_Schema.find({'nom': req.query['nom']}, function (err, insta) {
            if (err) return handleError(err);

            res.header("Content-Type", "application/json");
            res.send({"installations" : insta}); 
        });
    }
	//------------------------------------------------
	// C1,C2,C3 : installations  selon condition 
	//-----------------------------------------------
	else if('condition' in req.query)
    {
        Installation_Schema.find({'condition': req.query['condition']}, function (err, insta) {
            if (err) return handleError(err);
			
			var liste = [];
			for (i in insta){
				liste.push({
					nom : insta[i].nom,
					ouvert : insta[i].ouvert,
					deblaye : insta[i].deblaye,
					condition : insta[i].condition,
					nom_arr : insta[i].arrondissement.nom_arr,
					cle : insta[i].arrondissement.cle,
					date_maj : insta[i].arrondissement.date_maj,
				});
			}
			liste.sort(function(a,b){
					return a.nom - b.nom;
				});
			//C2 : liste en XML 
			if(req.query['type'] == 'XML' || req.query['type'] == 'xml'){
                var js2xmlparser = require("js2xmlparser");
                var xml = js2xmlparser.parse("installations", liste);
                res.header("Content-Type", "application/xml; charset=utf-8");
                res.send(xml); 
            }
			//C3 : liste en CSV
			if(req.query['type'] == 'CSV' || req.query['type'] == 'csv'){
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
			// C1 : liste texte, en ordre croissant
			else {	
				res.header("Content-Type", "text/plain; charset=utf-8");
				res.send(liste); 
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
  if (req.body.u_nom && req.body.u_prenom && req.body.u_courriel ){
	var user = {"nom": req.body.u_nom,
				"prenom": req.body.u_prenom,
				"courriel": req.body.u_courriel,
				"nom_arr_surv": [
								req.body.u_nom_arr1,
								req.body.u_nom_arr2,
								req.body.u_nom_arr3
								]
				};
  
	var result = jsonschema.validate(user, schemas.createUser);
	if (result.errors.length > 0) {
		res.status(400).json(result);
    } else {   		
		var u_schema = new User_Schema(user);
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
  } else {
	  res.send("form not completed");
  }		
});	

//-----------------------------------------------
module.exports = router;
