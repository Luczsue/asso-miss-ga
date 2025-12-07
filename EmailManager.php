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
        $this->headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_USER . ">\r\n";
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
            $result = mail($this->to, $this->subject, $this->message, $headers);

            if ($result) {
                logSuccess('Email envoyé à: ' . $this->to);
                return true;
            } else {
                throw new Exception('Erreur lors de l\'envoi de l\'email');
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
