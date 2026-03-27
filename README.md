## Message Board


Le but était de créer :
- un micro-service NodeJS capable de stocker et fournir des messages ;
- une interface web en HTML/CSS/JavaScript ;
- une communication entre le client et le serveur avec des requêtes HTTP et des réponses JSON.

L’application permet de :
- voir tous les messages ;
- ajouter un message avec un pseudo, un texte et une date ;
- supprimer un message ;
- rafraîchir la liste ;
- changer le thème de la page ;


### Structure du projet
```
message-board/
├── index.js
├── package.json
├── README.md
└── public/
    ├── index.html
    ├── script.js
    └── style.css
```


### Fonctionnement général

Le projet repose sur une architecture client / serveur très simple :
- le serveur garde une liste de messages en mémoire ;
- le client interroge le serveur avec fetch() ;
- les échanges se font au format JSON.

Quand la page se charge, elle récupère la liste des messages depuis le serveur et les affiche.
Quand on envoie un nouveau message, le client appelle une route du micro-service puis recharge la liste.
Même logique pour la suppression.

⸻

Structure des données

Les messages sont stockés côté serveur dans un tableau JavaScript.

Chaque message est représenté par un objet de la forme :

{
  pseudo: "Alice",
  texte: "Bonjour à tous !",
  date: "2026-03-06 09:00"
}

J’ai choisi cette structure parce qu’elle est simple et qu’elle permet de stocker directement toutes les informations utiles à l’affichage.


### Ce qui a été fait côté client

Le fichier script.js gère l’affichage et les interactions avec le serveur.

Chargement des messages

Quand la page s’ouvre, le client envoie une requête vers :

/msg/getAll

puis affiche le résultat dans la liste HTML.


#### Envoi d’un message

Quand on clique sur Envoyer :
	1.	le pseudo et le texte sont récupérés ;
	2.	la date du moment est générée ;
	3.	un objet message est créé ;
	4.	cet objet est transformé en JSON puis encodé dans l’URL ;
	5.	le client appelle /msg/post/... ;
	6.	la liste est rechargée.


#### Suppression d’un message

Chaque message affiché possède un bouton Supprimer.

Quand on clique dessus :
	1.	une confirmation est demandée ;
	2.	le client appelle /msg/del/:id ;
	3.	la liste est rechargée si la suppression réussit.


#### Rafraîchissement manuel

Le bouton Mise à jour permet de relancer à la main la récupération des messages depuis le serveur.


#### Changement de thème

Le bouton Changer de style ajoute ou enlève une classe CSS dark sur le body, ce qui permet de passer d’un thème clair à un thème sombre.



#### Choix d’implémentation

J’ai gardé une implémentation volontairement simple pour rester dans l’esprit du TP.

Utilisation de GET pour toutes les routes

Dans une application réelle, on utiliserait plutôt :
- POST pour créer ;
- DELETE pour supprimer.

Mais ici, le sujet demandait explicitement une approche simple facilement testable depuis le navigateur. Le choix de GET est donc cohérent avec la consigne.

#### Stockage en mémoire

Les messages sont stockés dans une variable JavaScript côté serveur.

C’est simple à mettre en place et suffisant pour le TP, mais cela signifie que toutes les données sont perdues au redémarrage du serveur.

#### Utilisation d’objets pour les messages

Au lieu de stocker uniquement une chaîne, j’ai choisi de stocker des objets complets avec un pseudo, un texte et une date. Cela permet un affichage plus propre et plus proche d’un vrai mur de messages.


### Limites du projet

Le projet fonctionne, mais il a aussi des limites normales pour un TP :
- les messages ne sont pas persistants ;
- ils sont perdus si le serveur redémarre ;
- la suppression repose sur l’index du tableau ;
- les routes utilisent GET même pour modifier les données ;
- il n’y a pas d’authentification ;
- il n’y a pas de base de données.

