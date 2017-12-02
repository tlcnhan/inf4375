function replaceTableContent(path) {
  var request = new XMLHttpRequest();
  var url = "/" + path;

  request.open("GET", url, true);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 304) {
      var tbody = document.getElementsByTagName("tbody")[0];
      tbody.innerHTML = "Hello";//request.responseText;
      document.getElementById("count").innerHTML = tbody.getElementsByTagName("tr").length;
    }
  };

  request.send();
}

$(document).ready(function() {
	// Remplis le menu déroulant 
    $.getJSON("/all/", function(data) {
        var options = $("#options");
        var names = [];

        $('#liste_installations').empty();
        $.each(data.installations, function (index, insta) {
            names.push(insta.nom);
        });
		console.log('Hello');
        names = unique(names);
        $.each(names, function(n) {
            options.append($("<option />").val(names[n]).text(names[n]));
        });
    });
	// Rercherche par nom d'arrondissement
    $('#i_nom_arr').submit(function(e) {
        e.preventDefault();
		
        console.log($('#i_nom_arr').serialize()); 
        
        $.ajax({
            url : $('#i_nom_arr').attr("action"),
            data : $('#i_nom_arr').serialize(),
            type : "GET",
            dataType : "json",
        }) 
        .done(function(data) {
            // Remplissage de la liste 
            $('#liste_installations').empty();
            $.each(data.installations, function (index, i) {
                $('#liste_installations').append(
                    $('<ul>').append(
                        '<li>' + i.nom + '</li>',
                        '<li>' + i.arrondissement.nom_arr + '</li>',
                        '<li>' + i.arrondissement.cle + '</li>',
                        '<li>' + i.arrondissement.date_maj + '</li>',
                        '<li>' + i.ouvert+ '</li>',
                        '<li>' + i.deblaye+ '</li>',
                        '<li>' + i.arrose + '</li>',
                        '<li>' + i.resurface + '</li>',
                        '<li>' + i.condition + '</li>'
					)
                );
            });
        })
        .fail(function(xhr, status, errorThrown) {
            alert("Erreur");
        });
    });
}); 
