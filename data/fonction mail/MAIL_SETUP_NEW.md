# Configuration de l'envoi d'e-mails (FR)

## 🎯 Résumé

Ce projet utilise une **architecture email unifiée et moderne**:

- **Frontend**: `contact.html` + `form-handler.js` (envoi async avec notifications)
- **Backend**: `process_contact.php` + `EmailManager.php` (gestion d'emails robuste)
- **Configuration**: `config.php` (centralisée et sécurisée)
- **Templates**: `templates/confirmation_email.php` et `templates/contact_message.php`

Les e-mails sont envoyés à **lucasmengue320@gmail.com**.

## 📁 Architecture

```
asso-miss-ga/
├── contact.html                 # Formulaire avec validation HTML5
├── form-handler.js              # Gestion async du formulaire + notifications
├── process_contact.php          # Handler backend
├── EmailManager.php             # Classe de gestion d'emails
├── config.php                   # Configuration centralisée
├── templates/
│   ├── confirmation_email.php   # Email de confirmation à l'utilisateur
│   └── contact_message.php      # Email de notification à l'admin
├── logs/                        # Répertoire pour les logs (créé automatiquement)
├── .env.example                 # Exemple de configuration sensible
└── send_mail.php                # ⚠️ OBSOLÈTE - ne pas utiliser
```

## ⚙️ Configuration

### 1. Adresses email de destination

Éditer `config.php` (lignes 14-18):

```php
define('EMAIL_CONTACT', 'lucasmengue320@gmail.com');
define('EMAIL_SUPPORT', 'lucasmengue320@gmail.com');
define('EMAIL_PARTNERSHIPS', 'lucasmengue320@gmail.com');
define('EMAIL_ADMIN', 'lucasmengue320@gmail.com');
define('FROM_MAIL', 'lucasmengue320@gmail.com');
define('FROM_NAME', 'Association des Miss du Gabon');
```

### 2. Credentials SMTP (Gmail)

Éditer `config.php` (lignes 8-13):

```php
define('SMTP_USER', 'votre-email@gmail.com');
define('SMTP_PASS', 'votre-app-password'); // App password si 2FA activé
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
```

**Important**: Générer un [Google App Password](https://myaccount.google.com/apppasswords) si vous utiliser l'authentification à deux facteurs.

### 3. Configuration sécurisée (Production)

Pour la sécurité, utiliser un fichier `.env`:

```bash
cp .env.example .env
# Éditer .env avec vos vraies valeurs
```

Puis modifier `config.php` pour charger les variables d'environnement:

```php
$env = parse_ini_file(__DIR__ . '/.env');
define('SMTP_USER', $env['SMTP_USER'] ?? getenv('SMTP_USER'));
define('SMTP_PASS', $env['SMTP_PASS'] ?? getenv('SMTP_PASS'));
// etc...
```

**Ajouter `.env` à `.gitignore`** (jamais commiter les secrets).

## 🧪 Tests

### Mode local (XAMPP/WAMP)

1. **Installer PHP mail** ou configurer `php.ini`:
   ```ini
   [mail function]
   SMTP = smtp.gmail.com
   smtp_port = 587
   ```

2. **Alternative**: Utiliser MailHog ou Mailtrap pour les tests

3. **Remplir le formulaire** sur `http://localhost/contact.html` et soumettre

4. **Feedback utilisateur**:
   - ✅ Succès: Notification verte "Votre message a bien été reçu"
   - ❌ Erreur: Notification rouge avec détails de l'erreur

### Logs

Les logs sont dans `logs/email.log` (créé automatiquement par `config.php`).

## 📧 Flux d'envoi

1. Utilisateur remplit `contact.html` et clique "Envoyer"
2. `form-handler.js` valide et envoie via fetch vers `process_contact.php`
3. `process_contact.php`:
   - Valide les données (nom, email, sujet, message)
   - Route selon le sujet (concours → EMAIL_CONTACT, partenariat → EMAIL_PARTNERSHIPS, etc.)
   - Envoie 2 emails via `EmailManager.php`:
     - **À l'utilisateur**: Confirmation (template `confirmation_email.php`)
     - **À l'association**: Notification du message (template `contact_message.php`)
4. Retour JSON avec `success: true/false` et message
5. `form-handler.js` affiche notification toast et réinitialise le formulaire

## 🔐 Sécurité

✅ **Bonnes pratiques implémentées**:
- Sanitization des inputs (`sanitizeInput()`)
- Validation email et téléphone côté serveur ET client
- Encodage UTF-8 pour les caractères spéciaux
- Logs d'erreurs sécurisés dans `logs/`
- Séparation config/code (config.php)
- FormData natif (pas de JSON brut)

📋 **À améliorer**:
- [ ] Activer reCAPTCHA (`RECAPTCHA_ENABLED = true` dans config.php)
- [ ] Rate limiting (limiter les soumissions par IP)
- [ ] HTTPS en production
- [ ] Variables d'environnement pour les secrets (.env)

## ❌ Fichiers obsolètes

`send_mail.php` n'est **plus utilisé**. Utiliser `process_contact.php` à la place.

## 📞 Support

Consultez les logs pour diagnostiquer les problèmes:
```bash
tail -f logs/email.log
```

Vérifiez que:
- [ ] `logs/` existe et est accessible en écriture
- [ ] `templates/confirmation_email.php` et `contact_message.php` existent
- [ ] PHP >= 7.0 avec support mail()
- [ ] SMTP credentials corrects pour Gmail
