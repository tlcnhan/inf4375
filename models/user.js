var mongoose = require("mongoose");

// Schéma sous lequel les users sont représentés dans la base de donnée
var user = mongoose.Schema({
	nom: String,
	prenom: String,
	courriel: String,
    nom_arr_surv: [String]
});

module.exports = mongoose.model('User', user);
