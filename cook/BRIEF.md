# BRIEF : site vitrine Coach Ton Bac (workflow « cook » du pack design IA)

Début : 2026-11-24. Livrable : dossier statique prêt pour LWS (`coachtonbac-site/www/`) + guide.

## Cible
Objectif chiffré : 20 rendez-vous gratuits par mois (fixé par le client le 2026-11-24).
Lieu : cours essentiellement en visio, présentiel possible dans le secteur de Moulins (03).
Site vitrine orienté conversion : un seul objectif par page, réserver le premier rendez-vous gratuit de 45 min (Calendly).
Public décideur : parents CSP+ exigeants. Marque mère « Bruno Bertin », gamme élèves « Coach Ton Bac ».
Argument central visible dès l'accueil : lecture « chirurgicale » des copies, passé d'examinateur et de membre de jury au bac de français.

## Références (cook/refs)
- R01 « The French Teacher » (capture) : bandeau marine, titres serif, or, portrait cerclé d'or, cartes à liseré or, accordéon « Qu'est-ce qui vous amène ? », un seul bouton or.
- R02 « Antoine One One » (HTML) : page de vente longue, barre fixe avec un seul CTA, titre à graisses mixtes, bande de 3 promesses, prix, « comment ça démarre », FAQ.
- R03 « Levrnsu » (capture) : bandeau sombre chevauché par une carte, 3 étapes en cartes colorées, aperçus de blog.
Ce qu'on prend : structure et ressenti. Ce qu'on ne copie pas : textes, visuels, couleurs exactes.

## Barre (note /10, juge sans contexte + vérifications mesurées)
Mise en page 9,5 · Typographie 9,5 · Couleur 9,5 · Clarté de conversion 9,5 · Mobile 9,5 · Exactitude du contenu 10 (tarifs, noms).

## Règles
- HTML autonome, JS vanilla, zéro dépendance, polices auto-hébergées (RGPD, pas de Google Fonts).
- Anti-slop : pas de dégradé violet, pas d'orbes lumineux, pas de compteurs 01/02/03, pas de tirets cadratins dans les textes, pas d'étiquettes en capitales monospace, pas de beige (crème froid et assumé à la place).
- Un seul moment signature : la copie annotée à l'encre rouge (animation transform/opacity, respect de prefers-reduced-motion).
- Aucune donnée inventée : pas de faux témoignages, pas de statistiques, pas de durée de stage non fournie.

## Décisions
- Maquettes multiples remplacées par une direction unique : les 3 références convergent (marine + or + serif + crème). Économie de tokens demandée.
- GSAP du pack écarté : contrainte « zéro dépendance ». Animation en CSS + 20 lignes de JS.
- Pages générées par `src/build.py` (gabarit commun) pour garantir des en-têtes/pieds identiques ; seul `www/` part en ligne.
