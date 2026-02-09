<?php
/**
 * Classe Email - Gestion d'envoi d'emails
 * Supporte SMTP, HTML templates, et pièces jointes
 */

require_once __DIR__ . '/config.php';

class EmailManager {
    private $to;
    private $subject;
    private $message;
    private $headers;
    private $attachments = [];
    private $replyTo = null;
    private $bcc = [];
    private $cc = [];

    /**
     * Constructeur
     */
    public function __construct() {
        $this->headers = "MIME-Version: 1.0\r\n";
        $this->headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $this->headers .= "From: " . FROM_NAME . " <" . FROM_MAIL . ">\r\n";
    }

    /**
     * Définir le destinataire
     */
    public function setTo($email, $name = '') {
        if (!validateEmail($email)) {
            throw new Exception('Email invalide: ' . $email);
        }
        $this->to = $name ? "$name <$email>" : $email;
        return $this;
    }

    /**
     * Ajouter un destinataire en copie
     */
    public function addCC($email, $name = '') {
        if (!validateEmail($email)) {
            throw new Exception('Email CC invalide: ' . $email);
        }
        $this->cc[] = $name ? "$name <$email>" : $email;
        return $this;
    }

    /**
     * Ajouter un destinataire en copie cachée
     */
    public function addBCC($email) {
        if (!validateEmail($email)) {
            throw new Exception('Email BCC invalide: ' . $email);
        }
        $this->bcc[] = $email;
        return $this;
    }

    /**
     * Définir le répondre-à
     */
    public function setReplyTo($email, $name = '') {
        if (!validateEmail($email)) {
            throw new Exception('Email reply-to invalide: ' . $email);
        }
        $this->replyTo = $name ? "$name <$email>" : $email;
        return $this;
    }

    /**
     * Définir l'objet du message
     */
    public function setSubject($subject) {
        $this->subject = $this->encodeSubject($subject);
        return $this;
    }

    /**
     * Définir le corps du message (HTML)
     */
    public function setMessage($message) {
        $this->message = $message;
        return $this;
    }

    /**
     * Charger un template HTML
     */
    public function loadTemplate($template_name, $variables = []) {
        $template_path = __DIR__ . '/templates/' . $template_name . '.php';
        
        if (!file_exists($template_path)) {
            throw new Exception('Template non trouvé: ' . $template_name);
        }

        // Extraire les variables
        extract($variables);

        // Charger le template
        ob_start();
        include $template_path;
        $this->message = ob_get_clean();

        return $this;
    }

    /**
     * Ajouter une pièce jointe
     */
    public function addAttachment($file_path, $file_name = null) {
        if (!file_exists($file_path)) {
            throw new Exception('Fichier non trouvé: ' . $file_path);
        }

        $file_size = filesize($file_path);
        if ($file_size > MAX_FILE_SIZE) {
            throw new Exception('Fichier trop volumineux: ' . $file_name);
        }

        $this->attachments[] = [
            'path' => $file_path,
            'name' => $file_name ?: basename($file_path)
        ];

        return $this;
    }

    /**
     * Envoyer l'email
     */
    public function send() {
        try {
            // Validation
            if (!$this->to || !$this->subject || !$this->message) {
                throw new Exception('Destinataire, sujet ou message manquant');
            }

            // Construire les headers additionnels
            $headers = $this->headers;

            if ($this->replyTo) {
                $headers .= "Reply-To: " . $this->replyTo . "\r\n";
            }

            if (!empty($this->cc)) {
                $headers .= "Cc: " . implode(', ', $this->cc) . "\r\n";
            }

            if (!empty($this->bcc)) {
                $headers .= "Bcc: " . implode(', ', $this->bcc) . "\r\n";
            }

            // Envoyer l'email
            // If PHPMailer is available and SMTP config exists, prefer SMTP
            if (file_exists(__DIR__ . '/vendor/autoload.php')) {
                require_once __DIR__ . '/vendor/autoload.php';
            }

            if (class_exists('PHPMailer\\PHPMailer\\PHPMailer') && defined('SMTP_HOST')) {
                try {
                    $mail = new PHPMailer\\PHPMailer\\PHPMailer(true);

                    // Use SMTP if credentials provided
                    $useSmtp = defined('SMTP_USER') && SMTP_USER;
                    if ($useSmtp) {
                        $mail->isSMTP();
                        $mail->Host = SMTP_HOST;
                        $mail->Port = SMTP_PORT ?? 587;
                        $mail->SMTPAuth = true;
                        $mail->Username = SMTP_USER;
                        $mail->Password = SMTP_PASS;
                        if (defined('SMTP_SECURE') && in_array(strtolower(SMTP_SECURE), ['ssl','tls'])) {
                            $mail->SMTPSecure = SMTP_SECURE;
                        }
                    }

                    // From
                    $mail->setFrom(FROM_MAIL, FROM_NAME);

                    // To (parse possible "Name <email>" format)
                    if (preg_match('/^(.*)\\s+<(.+)>$/', $this->to, $m)) {
                        $mail->addAddress(trim($m[2]), trim($m[1]));
                    } else {
                        $mail->addAddress($this->to);
                    }

                    // Reply-To
                    if ($this->replyTo) {
                        if (preg_match('/^(.*)\\s+<(.+)>$/', $this->replyTo, $r)) {
                            $mail->addReplyTo(trim($r[2]), trim($r[1]));
                        } else {
                            $mail->addReplyTo($this->replyTo);
                        }
                    }

                    // CC / BCC
                    foreach ($this->cc as $cc) {
                        $mail->addCC($cc);
                    }
                    foreach ($this->bcc as $bcc) {
                        $mail->addBCC($bcc);
                    }

                    // Attachments
                    foreach ($this->attachments as $att) {
                        $mail->addAttachment($att['path'], $att['name']);
                    }

                    // Content
                    $mail->isHTML(true);
                    $mail->CharSet = 'UTF-8';
                    $mail->Subject = $this->subject;
                    $mail->Body = $this->message;
                    $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $this->message));

                    $mail->send();
                    logSuccess('Email (SMTP) envoyé à: ' . $this->to);
                    return true;
                } catch (Exception $e) {
                    // Continue to fallback to mail()
                    logError('PHPMailer error: ' . $e->getMessage());
                }
            }

            // Fallback to PHP mail()
            // If attachments exist and PHPMailer not available, we refuse to attempt raw attachment assembly
            if (!empty($this->attachments)) {
                throw new Exception('Des pièces jointes sont présentes mais l\'envoi SMTP (PHPMailer) n\'est pas disponible');
            }

            $result = mail($this->to, $this->subject, $this->message, $headers);

            if ($result) {
                logSuccess('Email envoyé via mail() à: ' . $this->to);
                return true;
            } else {
                throw new Exception('Erreur lors de l\'envoi de l\'email via mail()');
            }

        } catch (Exception $e) {
            logError('Erreur d\'envoi email: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Encoder l'objet pour les caractères spéciaux
     */
    private function encodeSubject($subject) {
        return '=?UTF-8?B?' . base64_encode($subject) . '?=';
    }

    /**
     * Obtenir le message HTML
     */
    public function getMessage() {
        return $this->message;
    }
}

?>
