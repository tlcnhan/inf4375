var mongoose = require("mongoose");

// Schéma sous lequel les installations sont représentés dans la base de donnée
var installation = mongoose.Schema({
    id_uev: String,
	nom: String,
    arrondissement: [{
		nom_arr: String, 
		cle: String, 
		date_maj: String
	}],
	nom_arr: String,
	adresse: String,
	type: String,
	ouvert: String,
    deblaye: String,
    arrose: String,
    resurface: String,
    condition: String,
	propriete: String,
	gestion: String,
	point_x: String,
	point_y: String,
	equipement: String,
	longitude : String,
	latitude : String	
});

module.exports = mongoose.model('Installation', installation);
