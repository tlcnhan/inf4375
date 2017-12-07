# Travail de session INF4375

TRAN, Le Cong Nhan  
TRAL24017901

## Description

Le projet consiste à récupérer un ensemble de données provenant de la ville de Montréal et d'offrir des
services à partir de ces données.

## Prérequis:

* node: 8.6.0 
* MongoDB: 3.4.9


## Installation:

1. Démarrer serveur mongo et node js.
2. Exécuter:
```Shell
  cd <Répertoire racine>\project\
  npm install
  npm start
```
- À l'aide d'un client mongo exécuter et 
  vérifier que la création de la BD est correcte
```Shell
use inf4375
show collections
```

- Résultats attendus

```Shell
Installations
Users
```
3.Puis utiliser un fureteur, l'application est disponible à:
```
http://localhost:3000/ et http://localhost:3000/userform
```
- La documentation de l'utilsation est disponible à:
```
http://localhost:3000/doc
```
## Fonctionnalités

* Rechercher des installations par arrondissement.
* Rechercher des installations par nom.
* Rechercher des installations par condition.
* Modifier d'une installation.
* Supprimer d'une installation.
* Créer un profil d'utilisateur.

## Exemples de donnée JSON

```
"installation": [    
            {
                "_id" : "5a06119a33b194281812cb59",
                "nom" : "Pat. avec bandes - près chalet, parc LaSalle (PSE)",
                "ouvert" : "",
                "deblaye" : "",
                "arrose" : "",
                "resurface" : "",
                "condition" : "Mauvaise",
                "arrondissement" : [
                                {
                                    "nom_arr" : "Lachine",
                                    "cle" : "lch",
                                    "date_maj" : "2017-02-20 13:45:14",
                                    "_id" : ObjectId("5a06119a33b194281812cb5a")
                                }	
                ],
                "__v" : 0
            },
            {
                "_id":"5a268f6833a7de13004ed490",
                "id_uev":"3114253",
                "nom":"Complexe sportif Claude-Robillard",
                "nom_arr":"Ahuntsic-Cartierville",
                "adresse":"1 000, Avenue Émile-Journeault Est",
                "type":"Piscine intérieure",
                "propriete":"Municipale",
                "gestion":"Municipale",
                "point_x":"294151,2717",
                "point_y":"5045855457",
                "equipement":"Complexe aquatique",
                "longitude":"-73.63639",
                "latitude":"45.552526",
                "__v":0,
                "arrondissement":[]
            }
```			
Dépendences
============
*    "body-parser": "~1.18.2",
*    "cookie-parser": "~1.4.3",
*    "csvtojson": "^1.1.9",
*    "debug": "~2.6.9",
*    "express": "~4.15.5",
*    "get-csv": "^3.0.3",
*    "jquery": "^3.2.1",
*    "js2xmlparser": "^3.0.0",
*    "json2csv": "^3.11.5",
*    "jsonschema": "^1.2.0",
*    "mongodb": "^2.2.33",
*    "mongoose": "^4.12.5",
*    "monk": "^6.0.5",
*    "morgan": "~1.9.0",
*    "node-schedule": "^1.2.5",
*    "pug": "2.0.0-beta11",
*    "raml2html": "^6.2.4",
*    "request": "^2.83.0",
*    "serve-favicon": "~2.4.5",
*    "xml2js": "^0.4.19",
*    "xmlhttprequest": "^1.8.0"
