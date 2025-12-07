<?php
/**
 * Configuration Email - Association des Miss du Gabon
 * Configurer les adresses email et les paramètres SMTP
 */

// ===================== CONFIGURATION EMAIL =====================
define('SMTP_HOST', 'smtp.gmail.com'); // ou votre serveur SMTP
define('SMTP_PORT', 587); // 587 pour TLS, 465 pour SSL
define('SMTP_USER', 'contact@missgarbon.ga'); // Votre adresse email
define('SMTP_PASS', 'your_password_here'); // Votre mot de passe (utiliser variables d'environnement en production)
define('SMTP_FROM_NAME', 'Association des Miss du Gabon');

// ===================== ADRESSES EMAIL =====================
define('EMAIL_CONTACT', 'contact@missgarbon.ga');
define('EMAIL_SUPPORT', 'support@missgarbon.ga');
define('EMAIL_PARTNERSHIPS', 'partnerships@missgarbon.ga');
define('EMAIL_ADMIN', 'admin@missgarbon.ga');

// ===================== CONFIGURATION SITE =====================
define('SITE_NAME', 'Association des Miss du Gabon');
define('SITE_URL', 'https://www.missgarbon.ga');
define('SITE_LOGO', SITE_URL . '/logo.jpg');

// ===================== VALIDATION =====================
define('MAX_FILE_SIZE', 5242880); // 5MB
define('ALLOWED_FILE_TYPES', ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif']);
define('RECAPTCHA_ENABLED', false); // Activer reCAPTCHA si nécessaire
define('RECAPTCHA_SECRET', 'your_recaptcha_secret_key');

// ===================== PARAMÈTRES DE SÉCURITÉ =====================
define('SESSION_TIMEOUT', 3600); // 1 heure
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_DURATION', 900); // 15 minutes

// ===================== BASE DE DONNÉES (optionnel) =====================
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'miss_gabon');

// ===================== MESSAGES =====================
define('MSG_SUCCESS_EMAIL_SENT', 'Votre message a été envoyé avec succès!');
define('MSG_ERROR_SENDING_EMAIL', 'Erreur lors de l\'envoi du message. Veuillez réessayer.');
define('MSG_ERROR_VALIDATION', 'Veuillez remplir tous les champs obligatoires.');
define('MSG_ERROR_FILE_SIZE', 'Le fichier est trop volumineux.');
define('MSG_ERROR_FILE_TYPE', 'Type de fichier non autorisé.');

// ===================== GESTION D'ERREURS =====================
error_reporting(E_ALL);
ini_set('display_errors', 0); // Ne pas afficher les erreurs directement
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/errors.log');

// Créer le dossier logs s'il n'existe pas
if (!is_dir(__DIR__ . '/logs')) {
    mkdir(__DIR__ . '/logs', 0755, true);
}

// ===================== FONCTION DE LOGGING =====================
function logError($message, $severity = 'ERROR') {
    $timestamp = date('Y-m-d H:i:s');
    $log_message = "[$timestamp] [$severity] $message\n";
    error_log($log_message, 3, __DIR__ . '/logs/email.log');
}

function logSuccess($message) {
    logError($message, 'SUCCESS');
}

// ===================== SANITIZATION =====================
function sanitizeInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    return preg_match('/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/', $phone);
}

?>
