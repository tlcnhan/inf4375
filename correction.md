# Travail de session INF4375

TRAN, Le Cong Nhan
TRAL24017901

## Description

Le projet consiste à récupérer un ensemble de données provenant de la ville de Montréal et d'offrir des
services à partir de ces données.

## Services dévéloppés

- A1: obtenir 3 listes de données et les stocker dans une base de données MongoDB.
  Testé avec les commandes de mongoDB pour voir le contenu de la base de données.
   . use inf4375
   . db.installations.find().pretty()
   
- A2: l'importation est schedulé à minuit de tous les jours.
  Testé en reglant l'heure voulue et révérifier la base de données,
  date de création du nouveau fichier téléchargé et le log à l'écran.
  
- A3: système écoute sur port 3000, route '/doc' affiche la documentation de tous
      les services REST du programme.
  Testé : 'localhost:3000/doc' avec le fureteur Chrome.
  
- A4: service REST avec un nom d'arrondisement en paramètre
     ex: GET /installations?arrondisement=LaSalle
 Testé 'localhost:3000/installations?arrondisement=LaSalle' et Chrome retourne texte en json.
 
- A5: service REST avec un nom d'arrondisement en paramètre à partir d'un formulaire HTML.
     Liste des installations retournée affichée dans un tableau
 Testé en donnant un nom au formulaire HTML avec Chrome et une liste des installations
 affichée dans le tableau voulu. Le formulaire est sur la page d'accueil '/'.
 
- A6: Une liste déroulante de toutes les installations et une service REST
      avec un nom d'installations en paramètre retourne les information de cette installation.
  Testé en chosissant un nom de la liste déroulante avec Chrome et ça retourne les information
  voulu de cette installation.
  
- C1: service REST retourne une liste des installations en condition "Mauvaise".
     la liste est triée en ordre croissante.
 Testé en donnant une condition 'Mauvaise' au formulaire HTML avec Chrome et une liste des
 installations affichée, triée.
 
- C2: service REST retourne une liste des installations en condition "Mauvaise".
     la liste est triée en ordre croissante. La liste en format XML.
 Testé "http://localhost:3000/installations?condition=Mauvaise&type=xml" avec Chrome 
 et une liste des installations est affichée, triée en format XML, coddage UTF-8 en entête.
 
- C3: service REST retourne une liste des installations en condition "Mauvaise".
     la liste est triée en ordre croissante. La liste en format CSV
 Testé "http://localhost:3000/installations?condition=Mauvaise&type=csv" avec Chrome 
 et un fichier en format CSV est téléchargé, les information triées et codées UTF-8 en entête.
 
- D1: service REST qui modifie l'état d'une glissade en envoyant un document json validé.
 Testé avec Chrome REST console en envoyant avec méthode PUT et l'id de l'objet les champs 
 à modifier en body et en format json.
 Verifie les information concernant l'id de l'objet modifié avec mongoDB.
 
- D2: service REST qui supprime d'une glissade en envoyant un document json validé.
 Testé avec Chrome REST console en envoyant avec méthode DELETE et l'id de l'objet en format json.
 Verifie l'existant de l'objet avec l'id avec mongoDB.

- E1: service REST permet de créer un profile d'utilisateur
 Testé avec Chrome REST console en donnant les information de l'utilisateur au body
 et méthode POST, entête en json.
 vérifie les information des utilisateurs auprès mongoDB.
 use inf4375
 db.users.find().pretty()

- E2: service REST permet de créer un profile d'utilisateur    
    avec une interface graphique en HTML.
 Testé en donnant les information au formulaire HTML à la page
 'localhost:3000/userform' et vérifie les information des utilisateurs auprès mongoDB.
 use inf4375
 db.users.find().pretty()
 
