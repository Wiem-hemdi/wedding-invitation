# Idriss & Insaf — Invitation mariage

Site statique d'invitation pour le mariage d'Idriss Manai & Insaf Bellar (20 septembre 2026).

## Structure

- `index.html` — page principale
- `assets/css/styles.css` — styles
- `assets/js/main.js` — compte à rebours, RSVP, animations
- `assets/images/` — photos du couple

## Modifier le site

1. Éditez les fichiers sur votre PC (textes, photos, couleurs…)
2. Remettez en ligne via Git (voir ci-dessous) — Netlify se met à jour automatiquement

## Hébergement : GitHub + Netlify

### Étape 1 — Créer le dépôt GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous (ou créez un compte)
2. Cliquez **New repository**
3. Nom suggéré : `wedding-invitation`
4. Laissez **Public**, ne cochez pas « Add README »
5. Cliquez **Create repository**

### Étape 2 — Envoyer le projet sur GitHub

Ouvrez PowerShell dans le dossier du projet et exécutez :

```powershell
cd C:\Users\Wiem\Desktop\wedding
git init
git add .
git commit -m "Site invitation mariage Idriss & Insaf"
git branch -M main
git remote add origin https://github.com/VOTRE-PSEUDO/wedding-invitation.git
git push -u origin main
```

Remplacez `VOTRE-PSEUDO` par votre nom d'utilisateur GitHub.

> GitHub vous demandera de vous connecter (navigateur ou token).

### Étape 3 — Connecter Netlify

1. Allez sur [netlify.com](https://www.netlify.com) → **Sign up** avec votre compte **GitHub**
2. **Add new site** → **Import an existing project**
3. Choisissez **GitHub** → autorisez Netlify → sélectionnez `wedding-invitation`
4. Paramètres de build (laissez par défaut) :
   - **Branch** : `main`
   - **Build command** : *(vide)*
   - **Publish directory** : `.`
5. Cliquez **Deploy site**

Netlify vous donne une URL du type `https://random-name.netlify.app`. Vous pourrez la renommer dans **Site settings → Domain management**.

### Étape 4 — Activer le formulaire RSVP

1. Ouvrez le site en ligne (pas en fichier local)
2. Envoyez un test depuis le formulaire RSVP
3. Vérifiez la boîte **wiem.hemdi@polytechnicien.tn** — un email FormSubmit demande l'activation (une seule fois)
4. Cliquez le lien de confirmation

## Mettre à jour le site après hébergement

À chaque modification :

```powershell
cd C:\Users\Wiem\Desktop\wedding
git add .
git commit -m "Mise à jour textes / photos"
git push
```

Netlify redéploie automatiquement en ~30 secondes.

## Alternative : GitHub Pages seul

Si vous préférez GitHub Pages sans Netlify :

1. Sur GitHub : **Settings → Pages**
2. **Source** : Deploy from branch → `main` → `/ (root)`
3. URL : `https://VOTRE-PSEUDO.github.io/wedding-invitation/`

Le formulaire RSVP fonctionne aussi sur GitHub Pages (HTTPS inclus).

## Personnalisation

| Élément | Fichier |
|---|---|
| Textes, noms, date | `index.html` |
| Couleurs, polices | `assets/css/styles.css` |
| Date du compte à rebours | `assets/js/main.js` → `2026-09-20T17:00:00` |
| Email RSVP | `assets/js/main.js` → `RSVP_EMAIL` |
| Photos | `assets/images/` + chemins dans `index.html` |
