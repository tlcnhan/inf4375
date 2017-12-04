var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function post() {
  var prenom = document.getElementById('champ-prenom').value;
  var nom = document.getElementById('champ-nom').value;
  var courriel = document.getElementById('champ-courriel').value;
  var nom_arr = document.getElementById('champ-nom-arr').value;
  
  var user = {
    prenom: prenom,
    nom: nom,
    courriel: courriel,
    nom_arr_surv: [nom_arr]
  };
  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/users", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 201) {
        alert('User enregistré');
      } else {
        alert('Erreur');
      }
    }
  };
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(user));
}

