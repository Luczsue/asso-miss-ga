Configuration de l'envoi d'e-mails (FR)

Résumé
------
Ce projet inclut un script PHP `send_mail.php` qui reçoit les soumissions du formulaire (`contact.html`) et envoie les e-mails à : **lucasmengue320@gmail.com**.

Options d'envoi
---------------
1. SMTP (recommandé)
   - Installer PHPMailer via Composer :
     ```bash
     composer require phpmailer/phpmailer
     ```
   - Editer `send_mail.php` : mettre `$useSMTP = true` et remplir `$smtpHost`, `$smtpPort`, `$smtpUser`, `$smtpPassword`, `$smtpSecure`.
   - Exemple (Gmail) : `Host = smtp.gmail.com`, `Port = 587`, `Secure = tls`. Utilisez un *app password* si le compte Gmail a l'authentification à deux facteurs.

2. PHP `mail()` (fallback)
   - Sur un hébergement mutualisé, `mail()` fonctionnera souvent par défaut.
   - En local (Windows + XAMPP/WAMP), vous devrez configurer `SMTP` et `smtp_port` dans `php.ini` ou utiliser une solution de test (MailHog, Mailtrap).

Test
----
- Remplissez le formulaire sur `contact.html` et envoyez.
- Vous serez redirigé vers `contact.html?status=success` en cas de succès, ou `?status=error&message=...` en cas d'erreur.

Sécurité & bonnes pratiques
--------------------------
- Ne stockez jamais de mots de passe SMTP dans le dépôt public. Utilisez des variables d'environnement sur le serveur ou un fichier de configuration non suivi par Git.
- Activez TLS/SSL et restreignez l'accès au compte email utilisé pour l'envoi.

Support
-------
Si vous voulez, je peux :
- Activer `$useSMTP = true` et ajouter un fichier `.env` d'exemple et l'intégration `vlucas/phpdotenv` pour charger les identifiants en toute sécurité.
- Ajouter des validations côté client et un captcha (reCAPTCHA) pour réduire le spam.
