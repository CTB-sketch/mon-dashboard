<?php
/**
 * Formulaire de contact Coach Ton Bac (hébergement LWS, fonction mail() de PHP).
 * À RÉGLER : les deux adresses ci-dessous doivent être des boîtes créées dans votre espace LWS.
 */
$DESTINATAIRE = 'contact@coachtonbac.fr';   // adresse qui reçoit les messages
$EXPEDITEUR   = 'site@coachtonbac.fr';      // adresse d'envoi : doit appartenir au domaine coachtonbac.fr
$RETOUR       = 'rendez-vous.html';

function retour($statut) {
    global $RETOUR;
    header('Location: ' . $RETOUR . '?envoi=' . $statut . '#contact', true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    retour('erreur');
}

// Piège à robots : ce champ caché doit rester vide.
if (!empty($_POST['site'])) {
    retour('ok');
}

function champ($nom, $max) {
    $v = isset($_POST[$nom]) ? trim((string) $_POST[$nom]) : '';
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);
    return mb_substr($v, 0, $max);
}

$nom     = champ('nom', 100);
$email   = champ('email', 150);
$besoin  = champ('besoin', 60);
$message = isset($_POST['message']) ? mb_substr(trim((string) $_POST['message']), 0, 3000) : '';
$consent = !empty($_POST['consent']);

if ($nom === '' || $message === '' || !$consent || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    retour('erreur');
}

$sujet = '=?UTF-8?B?' . base64_encode('[Coach Ton Bac] ' . $besoin . ' · ' . $nom) . '?=';
$corps = "Nouveau message depuis coachtonbac.fr\n\n"
       . "Nom : $nom\nE-mail : $email\nÉpreuve : $besoin\n\n"
       . "Message :\n$message\n";
$entetes = 'From: Coach Ton Bac <' . $EXPEDITEUR . ">\r\n"
         . 'Reply-To: ' . $email . "\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n"
         . "Content-Transfer-Encoding: 8bit\r\n";

$ok = mail($DESTINATAIRE, $sujet, $corps, $entetes, '-f' . $EXPEDITEUR);
retour($ok ? 'ok' : 'erreur');
