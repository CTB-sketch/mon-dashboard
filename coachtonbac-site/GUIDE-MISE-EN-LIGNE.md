# Mise en ligne de coachtonbac.fr chez LWS

**Fichier à récupérer :** `coachtonbac-www.zip` (le contenu du dossier `www/`). C'est tout le site.

## Avant l'envoi (10 min)
1. **Lien Calendly** : ouvrez `www/rendez-vous.html`, remplacez les 2 occurrences de `https://calendly.com/VOTRE-LIEN/45min` par le lien de votre événement de 45 min (Calendly > l'événement > Copier le lien). L'agenda s'affiche alors directement dans la page.
2. **Boîtes mail** : dans le panel LWS, créez `contact@coachtonbac.fr` (réception) et `site@coachtonbac.fr` (envoi du formulaire). Pour d'autres adresses, modifiez les 2 lignes en haut de `www/contact.php`.
3. **Mentions légales** : complétez les zones surlignées en jaune dans `www/mentions-legales.html` (statut, SIRET, adresse) et vérifiez l'adresse de LWS.
4. **Photo (recommandé)** : déposez `bruno-bertin.jpg` (carré ou portrait, ~600 px) dans `www/assets/img/` et suivez le commentaire dans `www/a-propos.html`.

## Envoi
1. Panel LWS > votre domaine > **SSL** : activez le certificat gratuit (indispensable : le site redirige tout vers https).
2. Panel LWS > **Gestionnaire de fichiers** (ou FileZilla avec les accès FTP fournis par LWS).
3. Ouvrez le dossier racine du site (en général `htdocs`, à vérifier dans votre panel), supprimez la page d'attente LWS, puis envoyez **le contenu** du zip (pas le dossier lui-même). Le fichier caché `.htaccess` doit être présent.
4. **coachtonbac.com** : dans le panel, rattachez-le au même hébergement (domaine supplémentaire ou alias). Le `.htaccess` le redirige automatiquement vers coachtonbac.fr.

## Vérifier (5 min)
- https://coachtonbac.fr s'ouvre en https, sans avertissement.
- Un bouton « Réserver » ouvre la page rendez-vous et l'agenda Calendly s'affiche.
- Envoyez-vous un message avec le formulaire : vous devez le recevoir sur contact@.
- Une adresse inventée (ex. /test) affiche la page 404 du site.
- Google Search Console : ajoutez le site et soumettez `https://coachtonbac.fr/sitemap.xml`.

## Modifier le site plus tard
Petites retouches : éditez directement les fichiers de `www/`. Refonte d'une page : modifiez `src/pages/…` puis lancez `python3 src/build.py` (régénère tout `www/` avec le même en-tête et pied de page). Attention : la régénération écrase les retouches faites dans `www/` ; reportez-les d'abord dans `src/`.
