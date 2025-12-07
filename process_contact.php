<?php
/**
 * Traitement du formulaire de contact
 * POST handler pour contact.html
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/EmailManager.php';

header('Content-Type: application/json');

// Vérifier la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer et sanitizer les données
$data = [
    'name' => isset($_POST['name']) ? sanitizeInput($_POST['name']) : '',
    'email' => isset($_POST['email']) ? sanitizeInput($_POST['email']) : '',
    'phone' => isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '',
    'subject' => isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '',
    'message' => isset($_POST['message']) ? sanitizeInput($_POST['message']) : ''
];

// Validation
$errors = [];

if (empty($data['name'])) $errors[] = 'Le nom est requis';
if (empty($data['email'])) $errors[] = 'L\'email est requis';
if (!validateEmail($data['email'])) $errors[] = 'L\'email est invalide';
if (empty($data['subject'])) $errors[] = 'Le sujet est requis';
if (empty($data['message'])) $errors[] = 'Le message est requis';

if (!empty($data['phone']) && !validatePhone($data['phone'])) {
    $errors[] = 'Le numéro de téléphone est invalide';
}

// Vérifier les erreurs de validation
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => MSG_ERROR_VALIDATION,
        'errors' => $errors
    ]);
    exit;
}

try {
    // Déterminer l'adresse email de destination selon le sujet
    $recipient_email = EMAIL_CONTACT;
    
    switch ($data['subject']) {
        case 'concours':
            $recipient_email = EMAIL_CONTACT;
            break;
        case 'partenariat':
            $recipient_email = EMAIL_PARTNERSHIPS;
            break;
        case 'media':
            $recipient_email = EMAIL_CONTACT;
            break;
        default:
            $recipient_email = EMAIL_SUPPORT;
    }

    // ===================== EMAIL À L'UTILISATEUR =====================
    $email_user = new EmailManager();
    $email_user->setTo($data['email'], $data['name'])
               ->setSubject('Confirmation de votre message - ' . SITE_NAME)
               ->loadTemplate('confirmation_email', [
                   'name' => $data['name'],
                   'subject' => $data['subject'],
                   'site_name' => SITE_NAME,
                   'contact_email' => EMAIL_CONTACT
               ])
               ->send();

    // ===================== EMAIL À L'ASSOCIATION =====================
    $email_admin = new EmailManager();
    $email_admin->setTo($recipient_email)
                ->setReplyTo($data['email'], $data['name'])
                ->setSubject('Nouveau message de contact - ' . $data['name'])
                ->loadTemplate('contact_message', [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'subject' => $data['subject'],
                    'message' => nl2br($data['message']),
                    'site_name' => SITE_NAME
                ])
                ->addBCC(EMAIL_ADMIN) // Copie à l'admin
                ->send();

    // Réponse succès
    logSuccess('Message de contact reçu de: ' . $data['email']);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => MSG_SUCCESS_EMAIL_SENT
    ]);

} catch (Exception $e) {
    logError('Erreur formulaire contact: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => MSG_ERROR_SENDING_EMAIL
    ]);
}

exit;

?>
