# Système Email - Association des Miss du Gabon

## 📋 Vue d'ensemble

Ce système PHP gère l'envoi d'emails sécurisé pour le site de l'Association des Miss du Gabon.

### Fichiers du système:
- `config.php` - Configuration centralisée (SMTP, emails, sécurité)
- `EmailManager.php` - Classe de gestion des emails
- `process_contact.php` - Handler POST pour le formulaire de contact
- `templates/confirmation_email.php` - Template email de confirmation utilisateur
- `templates/contact_message.php` - Template email pour l'association
- `form-handler.js` - Gestion JavaScript du formulaire
- `logs/` - Dossier pour les logs d'erreur

## 🚀 Installation

### 1. Configuration SMTP

Éditer `config.php` et configurer:

```php
define('SMTP_HOST', 'smtp.gmail.com'); // Votre serveur SMTP
define('SMTP_PORT', 587); // Port (587 TLS, 465 SSL)
define('SMTP_USER', 'contact@missgarbon.ga'); // Votre email
define('SMTP_PASS', 'your_password_here'); // Votre mot de passe
```

**Options populaires:**
- **Gmail**: `smtp.gmail.com:587` (TLS)
- **Outlook**: `smtp.outlook.com:587` (TLS)
- **OVH**: `ns0000000.ip-XXX-XXX-XXX.net:587`
- **Votre serveur**: Contacter votre hébergeur

### 2. Permissions des dossiers

```bash
# Linux/Mac
mkdir -p templates logs
chmod 755 templates logs
chmod 644 config.php EmailManager.php process_contact.php form-handler.js
```

### 3. Intégrer le formulaire HTML

Dans `contact.html`, modifier le formulaire:

```html
<form id="contactForm" method="POST" enctype="multipart/form-data">
    <div class="form-group">
        <input type="text" name="name" placeholder="Votre nom" required>
    </div>
    <div class="form-group">
        <input type="email" name="email" placeholder="Votre email" required>
    </div>
    <div class="form-group">
        <input type="tel" name="phone" placeholder="Votre téléphone">
    </div>
    <div class="form-group">
        <select name="subject" required>
            <option value="">Sujet du message</option>
            <option value="concours">Inscription concours</option>
            <option value="partenariat">Partenariat</option>
            <option value="question">Question générale</option>
            <option value="media">Demande médias</option>
            <option value="autre">Autre</option>
        </select>
    </div>
    <div class="form-group">
        <textarea name="message" placeholder="Votre message" rows="5" required></textarea>
    </div>
    <button type="submit" class="btn btn-primary btn-block">Envoyer le message</button>
</form>

<!-- Ajouter le script -->
<script src="form-handler.js"></script>
```

## 🔧 Utilisation avancée

### Envoyer un email personnalisé

```php
<?php
require_once 'EmailManager.php';

try {
    $email = new EmailManager();
    $email->setTo('destinataire@example.com', 'Nom du destinataire')
          ->setSubject('Sujet du message')
          ->loadTemplate('ma_template', [
              'name' => 'Jean',
              'message' => 'Contenu personnalisé'
          ])
          ->addCC('copie@example.com')
          ->addBCC('admin@missgarbon.ga')
          ->send();
          
    echo "Email envoyé avec succès!";
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage();
}
?>
```

### Créer un nouveau template

1. Créer un fichier `templates/mon_template.php`:

```php
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Vos styles */
    </style>
</head>
<body>
    <h1>Bienvenue <?php echo $name; ?></h1>
    <p><?php echo $message; ?></p>
</body>
</html>
```

2. L'utiliser:

```php
$email->loadTemplate('mon_template', [
    'name' => 'Jean',
    'message' => 'Contenu'
])->send();
```

## 🔐 Sécurité

### Best Practices:

1. **Utiliser les variables d'environnement** pour les données sensibles:

```php
// Utiliser .env au lieu de hardcoder
define('SMTP_PASS', getenv('SMTP_PASSWORD'));
```

2. **Sanitizer les inputs**:
```php
$name = sanitizeInput($_POST['name']);
$email = sanitizeInput($_POST['email']);
```

3. **Valider les emails**:
```php
if (!validateEmail($email)) {
    throw new Exception('Email invalide');
}
```

4. **Limiter les tentatives** (à implémenter):
```php
// Dans process_contact.php
checkRateLimit($_SERVER['REMOTE_ADDR']);
```

5. **Utiliser HTTPS** en production

6. **Activer reCAPTCHA** pour éviter les spams:
```php
define('RECAPTCHA_ENABLED', true);
define('RECAPTCHA_SECRET', 'votre_cle_secret');
```

## 📊 Logs et Debugging

Les erreurs sont enregistrées dans `logs/email.log`:

```
[2025-01-01 10:30:45] [SUCCESS] Email envoyé à: user@example.com
[2025-01-01 10:35:12] [ERROR] Email invalide: notanemail
```

Consulter les logs:
```bash
tail -f logs/email.log
```

## 🧪 Tester le système

### Test local:

```bash
# Linux
php -S localhost:8000

# Puis accéder à: http://localhost:8000/contact.html
```

### Test de formulaire:

```bash
curl -X POST http://localhost:8000/process_contact.php \
  -d "name=Test&email=test@example.com&subject=test&message=Test message"
```

## 🐛 Troubleshooting

### "Erreur lors de l'envoi du message"

1. Vérifier les logs: `logs/email.log`
2. Vérifier la configuration SMTP dans `config.php`
3. Vérifier les permissions: `chmod 755 logs/`
4. Tester la connexion SMTP:

```bash
telnet smtp.gmail.com 587
```

### "Email non reçu"

1. Vérifier les paramètres SMTP
2. Vérifier que le serveur autorise PHP mail()
3. Vérifier que les emails ne sont pas dans les spams
4. Vérifier les configurations SPF/DKIM:

```bash
# Vérifier l'enregistrement SPF
dig TXT missgarbon.ga
```

### "Caractères spéciaux mal encodés"

- Vérifier l'encoding UTF-8 dans `config.php`
- Vérifier les headers dans `EmailManager.php`
- Vérifier le charset dans les templates HTML

## 📱 Responsive Email

Les templates email supportent:
- Desktop
- Tablet
- Mobile

Teste sur: https://www.litmus.com/

## 🚀 Production

Checklist avant le déploiement:

- [ ] Configuration SMTP correcte
- [ ] Variables sensibles dans .env
- [ ] Tests complets du formulaire
- [ ] Vérification des emails reçus
- [ ] Logs activés et surveillés
- [ ] SSL/HTTPS configuré
- [ ] Backups des logs
- [ ] Rate limiting implémenté
- [ ] reCAPTCHA activé
- [ ] Monitoring des erreurs

## 📧 Adresses email configurées

- **Contact général**: contact@missgarbon.ga
- **Support**: support@missgarbon.ga
- **Partenariats**: partnerships@missgarbon.ga
- **Admin**: admin@missgarbon.ga

À personnaliser dans `config.php`

## 📞 Support

Pour des problèmes ou questions:
- Vérifier `logs/email.log`
- Consulter la documentation PHP Mail
- Contacter votre hébergeur pour l'accès SMTP

---

**Dernière mise à jour**: 6 décembre 2025
**Version**: 1.0
