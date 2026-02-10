<?php
// send_mail.php
// Simple contact form mailer with optional SMTP (PHPMailer) support.

// === CONFIGURATION ===
$recipient = 'lucasmengue320@gmail.com';
$siteName = 'Association des Miss du Gabon';

// If you want to use SMTP (recommended for reliability), set $useSMTP = true
// and configure the SMTP details below (example for Gmail + app password):
$useSMTP = false; // set to true after filling the SMTP settings
$smtpHost = 'smtp.gmail.com';
$smtpPort = 587;
$smtpUser = 'your-smtp-username@gmail.com';
$smtpPassword = 'your-smtp-app-password';
$smtpSecure = 'tls'; // 'tls' or 'ssl'

// === END CONFIGURATION ===

function redirectWith($status, $message = ''){
    $message = rawurlencode($message);
    header("Location: contact.html?status={$status}&message={$message}");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirectWith('error', 'Requête invalide.');
}

// Get and sanitize form inputs
$name = substr(trim($_POST['name'] ?? ''), 0, 200);
$email = substr(trim($_POST['email'] ?? ''), 0, 200);
$phone = substr(trim($_POST['phone'] ?? ''), 0, 100);
$subject = substr(trim($_POST['subject'] ?? 'Message depuis le site'), 0, 200);
$message = trim($_POST['message'] ?? '');

if (!$name || !$email || !$message) {
    redirectWith('error', 'Veuillez renseigner votre nom, email et message.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirectWith('error', 'Adresse e-mail invalide.');
}

// Build email
$emailSubject = "[Contact] " . $subject;
$emailBody  = "Nouveau message depuis le site web\n\n";
$emailBody .= "Nom: " . $name . "\n";
$emailBody .= "Email: " . $email . "\n";
$emailBody .= "Téléphone: " . $phone . "\n";
$emailBody .= "Sujet: " . $subject . "\n\n";
$emailBody .= "Message:\n" . $message . "\n\n";
$emailBody .= "---\n";
$emailBody .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
$emailBody .= "Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown') . "\n";

$sent = false;

// Try PHPMailer if installed and $useSMTP is true
if ($useSMTP && file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';

    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        // SMTP config
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPassword;
        $mail->SMTPSecure = $smtpSecure;
        $mail->Port = $smtpPort;

        // From and reply-to
        $mail->setFrom('noreply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), $siteName);
        $mail->addAddress($recipient);
        $mail->addReplyTo($email, $name);

        // Content
        $mail->Subject = $emailSubject;
        $mail->Body = $emailBody;

        $mail->send();
        $sent = true;
    } catch (Exception $e) {
        // fallback to mail() below
        $sent = false;
    }
}

// Fallback to PHP mail() if PHPMailer wasn't used or failed
if (!$sent) {
    $from = 'noreply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost');
    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type: text/plain; charset=UTF-8" . "\r\n";
    $headers .= "From: " . $siteName . " <" . $from . ">" . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";

    // Use @ to suppress warnings from mail() — errors will be handled by redirect
    $sent = @mail($recipient, $emailSubject, $emailBody, $headers);
}

if ($sent) {
    redirectWith('success');
} else {
    redirectWith('error', 'Impossible d\'envoyer le message. Contactez l\'administrateur.');
}
