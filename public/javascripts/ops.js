// A6 : liste deroulante des noms des installations
//-------------------------------------------------------------------------
$(document).ready(function() {
    $.getJSON("/all", function(data) {
        var options = $("#options");
        var names = [];

        $('#liste-installations').empty();
        $.each(data.installations, function (index, insta) {
            names.push(insta.nom);
        });
        $.each(names, function(n) {
            options.append($("<option />").val(names[n]).text(names[n]));
        });
    });
});
// A6: Affichage de l'information de l'installation
//--------------------------------------------------------------------------- 
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function get_avec_nom() { 
  var xhr = new XMLHttpRequest();
  var nom = document.getElementById('options').value;
  
  xhr.open("GET", "/installations?nom="+ nom, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var object = JSON.parse(xhr.responseText);
		var res_nom = document.getElementById('res-nom');	
		$(res_nom).empty();
		$.each(object.installations, function(i,insta) {
			var nom_arr_verif = '';
			var cle = '';
			var date_maj = '';
			if(insta.nom_arr != undefined) {
				nom_arr_verif = insta.nom_arr;
			} else {
				nom_arr_verif = insta.arrondissement[0].nom_arr;
				cle = insta.arrondissement[0].cle;
				date_maj = insta.arrondissement[0].date_maj;
			}
			
            $(res_nom).append(
				$('<ul>').append(
					'<li>' +'Nom : ' + insta.nom + '</li>',
					'<li>' +'Arrondissement : ' + nom_arr_verif + '</li>',
					'<li>' +'Clé : ' + cle + '</li>',
					'<li>' +'Date de mis à jour : ' + date_maj + '</li>',
					'<li>' +'Adresse : ' + insta.adresse + '</li>',
					'<li>' +'Type : ' + insta.type + '</li>',
					'<li>' +'Ouvert : ' + insta.ouvert + '</li>',
					'<li>' +'Deblaye : ' + insta.deblaye + '</li>',
					'<li>' +'Arrose : ' + insta.arrose + '</li>',
					'<li>' +'Resurface : ' + insta.resurface + '</li>',
					'<li>' +'Condition : ' + insta.condition + '</li>',
					'<li>' +'Propreté : ' + insta.proprete + '</li>',
					'<li>' +'Gestion : ' + insta.gestion + '</li>',
					'<li>' +'Equipement : ' + insta.equipement + '</li>'
				)
			);
        });	
      } else {
        alert('Erreur');
      }
    }
  };
  xhr.send();
}
// A5: liste des installations par arrondissement
//---------------------------------------------------------------------------
function get_avec_nom_arr() {
  var xhr = new XMLHttpRequest();
  var nom_arr = document.getElementById('champ-nom-arr').value;
  
  xhr.open("GET", "/installations?arrondissement="+ nom_arr, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var object = JSON.parse(xhr.responseText);
		var tbody = document.getElementsByTagName("tbody");
		$(tbody).empty();
		$.each(object.installations, function(index,insta) {
            $(tbody).append(
				$('<ul>').append(
					'<li>' + insta.nom + '</li>',
				)
			);
        });	
	  } else {
        alert('Erreur');
      }
    }
  };
  xhr.send();
}
//------------------------------------------------------------------------------
function get_avec_condition() { 
  var xhr = new XMLHttpRequest();
  var condition = document.getElementById('champ-condition').value;
  
  xhr.open("GET", "/installations?condition="+ condition, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var object = JSON.parse(xhr.responseText);
		var res_condition = document.getElementById('res-condition');	
		$(res_condition).empty();
		$.each(object.installations, function(i,insta) {
			
            $(res_condition).append(
				$('<ul>').append(
					'<li>' +'Nom : ' + insta.nom + '</li>',
					'<li>' +'Arrondissement : ' + insta.nom_arr + '</li>',
					'<li>' +'Clé : ' + insta.cle + '</li>',
					'<li>' +'Date de mis à jour : ' + insta.date_maj + '</li>',
					'<li>' +'Adresse : ' + insta.adresse + '</li>',
					'<li>' +'Type : ' + insta.type + '</li>',
					'<li>' +'Ouvert : ' + insta.ouvert + '</li>',
					'<li>' +'Deblaye : ' + insta.deblaye + '</li>',
					'<li>' +'Arrose : ' + insta.arrose + '</li>',
					'<li>' +'Resurface : ' + insta.resurface + '</li>',
					'<li>' +'Condition : ' + insta.condition + '</li>',
					'<li>' +'Propreté : ' + insta.proprete + '</li>',
					'<li>' +'Gestion : ' + insta.gestion + '</li>',
					'<li>' +'Equipement : ' + insta.equipement + '</li>'
				)
			);
        });	
      } else {
        alert('Erreur');
      }
    }
  };
  xhr.send();
}