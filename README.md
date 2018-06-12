# Labo 5 HTTP Infra
Guillaume Hochet & Guillaume Blanco

## Step 1 apache static
branch: step1
Créer une image docker pour apache-php
- Se mettre dans le répertoire apache-php
- Faire un `docker build -t res/apache_php .`
- Lancer le container avec `docker run -d -p 8090:80 res/apache_php`

Fichiers de configuration apache dans `/etc/apache2`. Pour y accéder dans un container qui tourne:
- `docker exec -it <container> /bin/bash`

## Step 2 express dynamic
branch: step2
On se base sur l'image docker nodejs officielle LTS
`src` contient tous les fichiers, ne pas oublier de faire un .gitignore et d'y ajouter `node_modules`

Pour lancer le container:
- Se mettre dans le répertoire express-dynamic/src
- exécuter `npm install` pour installer chance et express (`npm install --save chance express`)
- remonter d'un niveau
- Exécuter `docker build -t res/express_dynamic .`
- Exécuter `docker run -d -p 8090:3000 res/express_dynamic` pour lancer le container

## Step 3 static reverse proxy
branch: step3-apache-reverse-proxy
On va créer un container docker spécialement pour le reverse proxy.
Tout d'abord on doit lancer les deux containers requis
- Lancer un container apache_php (port 80): `docker run -d --name apache_static res/apache_php` appelé apache_static
- Lancer un container express_dynamic (port 3000): `docker run -d --name express_dynamic res/express_dynamic`
- Récupérer les adresses IP des container avec `docker inspect <container> | grep "IPAddress"`

Dans notre cas on obtient 172.17.0.2 pour apache_static et 172.17.0.3 pour express_dynamic
On peut ensuite lancer le container de reverse proxy
- Se placer dans docker-images/apache-reverse-proxy
- Editer le fichier /conf/sites-available/001-reverse-proxy.conf
- Remplacer les adresses IP par celles obtenues précédemment
- Exécuter un `docker build -t res/apache_reverse_proxy .`
- Démarrer le container avec `docker run -d -p 8080:80 --name apache-reverse-proxy res/apache_reverse_proxy`
- Récupérer l'adresse IP du container nouvellement créé
- Modifier le fichier `/etc/hosts` pour mettre à jour les DNS en ajoutant la ligne `localhost demo.res.ch`

## Step 4 ajax jquery
branch: step4-ajax-jquery
Pour réaliser cette étape, il faut tout d'abord fermer les containers existants.
On modifie ensuite le code html de l'image `apache_php` pour y inclure un fichier javascript qui s'occupera
de pull des informations en ajax. 
L'utilisation du reverse proxy permet ainsi d'éviter de faire face au `Cross-Origin request` qui empêcherait
de faire cet appel d'API.

Relancer ensuite les containers comme dans l'étape 3, puis se rendre sur demo.res.ch:8080 pour apprécier la vue.

## Step 5 Dynamic reverse proxy
Branche: step5-dynamic-configuration
Il est possible de définir des variables d'environnement pour un container donné, on y passe ainsi les adresses
IPs afin de les utiliser dans un script au lancement du container.
- Créer un template php permettant de générer le contenu du fichier `001-reverse-proxy.conf` et qui y écrit les
valeurs des variables d'environnement données
- On crée ainsi un fichier apache2-foreground basé sur celui des auteurs de l'image docker qui exécutera ce template
- Rendre le script exécutable `chmod 755 apache2-foreground`
- Mettre à jour le Dockerfile pour le copier à la place de l'existant
- Construire l'image avec un `docker build -t res/apache_reverse_proxy .`
- Récupérer les adresses IPs des containers express_dynamic et apache_static
- Lancer le container reverse proxy avec `docker run -d -e STATIC_APP=172.17.0.2:80 -e DYNAMIC_APP=172.17.0.3:3000 res/apache_reverse_proxy`

## Additional steps
### UI management
On utilise portainer pour la gestion en interface graphique

Il suffit d'exécuter les commandes suivantes:
- `docker volume create portainer_data`
- `docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer`

Credentials locaux: admin password

### Node balancing
branche: BONUS-node-balancing
Source: https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html
Pour fonctionner, on doit modifier le reverse proxy défini précédemment. On s'appuie sur les modules mod_proxy_balancer et mod_lbmethod_byrequests pour
y arriver.
Pour fonctionner il faut
- Rebuild les trois images proprement
- lancer un certain nombre de containers apache_php avec `docker run -d res/apache_php`
- lancer un certain nombre de containers express_dynamic avec `docker run -d res/express_dynamic`
- exécuter le script php livré `php command.php` qui construira la commande à exécuter pour lancer le container de reverse proxy node balancing

Nous avons concu le système pour qu'il puisse gérer un nombre indéfini de containers et générer la configuration apache à la volée.
Pour tester, rendez-vous sur `demo.res.ch:8080` où vous pourrez voir l'IP du container dynamique qui a délivré la requête s'afficher et changer au fur et à mesure
On peut également accéder au manager apache depuis `demo.res.ch:8080/balancer-manager`

### Sticky sessions
branch BONUS-sticky-sessions
On se base sur le node balancing pour illustrer le concept. Dans le cas précédent, l'adresse IP du container changeait automatiquement. Le but ici est de 
conserver la même.

Source: https://httpd.apache.org/docs/2.4/fr/mod/mod_proxy_balancer.html
Pour fonctionner il faut:
- Rebuild l'image reverse-proxy
- Relancer `php command.php` qui vous donnera la commande à exécuter

On peut ensuite observer depuis `demo.res.ch:8080` que les appels d'API se font depuis le même container à chaque fois, l'adresse IP ne change pas. On peut
ouvrir un autre naviguateur ou une fenêtre privée pour voir que l'IP est différente mais ne change pas!