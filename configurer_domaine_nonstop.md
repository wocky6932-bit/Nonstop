# 🏷️ Configuration du Domaine "Nonstop"

## 🎯 Objectif
Configurer votre application pour qu'elle soit accessible via un domaine "nonstop" au lieu de l'URL générée automatiquement.

## 🔧 Options Disponibles

### Option 1: Domaine Personnalisé sur Vercel (Recommandé)

#### Étapes :
1. **Allez dans Vercel Dashboard**
   - [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sélectionnez votre projet "ecommerce-app"

2. **Accédez aux paramètres de domaine**
   - Cliquez sur l'onglet **"Domains"** dans les settings
   - OU allez dans **Settings > Domains**

3. **Ajouter un domaine personnalisé**
   - Cliquez sur **"Add Domain"**
   - Tapez : `nonstop.vercel.app`
   - OU si vous avez un vrai domaine : `nonstop.com`

4. **Configuration automatique**
   - Vercel créera automatiquement le sous-domaine
   - SSL certificate sera généré automatiquement
   - Redirection configurée automatiquement

#### Résultat attendu :
- **Nouvelle URL** : https://nonstop.vercel.app
- **Alias** : https://ecommerce-app-iota-lime.vercel.app (toujours fonctionnel)

### Option 2: Renommer le Projet

1. **Modifier le nom dans package.json**
   ```json
   {
     "name": "nonstop-ecommerce",
     // reste du fichier...
   }
   ```

2. **Redéployer**
   ```bash
   vercel --prod
   ```

### Option 3: Sous-domaine Vercel Gratuit

Vercel propose automatiquement des sous-domaines gratuits :
- `{project-name}.vercel.app`
- `{random-string}.vercel.app`

Pour "nonstop", vous pourriez avoir :
- `nonstop.vercel.app` (si disponible)
- `nonstop-[random].vercel.app`

## 🚀 Commande Rapide

Pour voir les domaines disponibles et en ajouter un :

```bash
# Voir les domaines actuels
vercel domains

# Ajouter un domaine
vercel domains add nonstop.vercel.app
```

## 📝 Instructions Détaillées

### Étape 1: Dashboard Vercel
1. Connectez-vous sur [vercel.com](https://vercel.com)
2. Allez dans votre dashboard
3. Cliquez sur le projet "ecommerce-app"

### Étape 2: Settings > Domains
1. Dans le menu de gauche, cliquez sur **"Domains"**
2. Vous verrez l'URL actuelle : `ecommerce-app-iota-lime.vercel.app`
3. Cliquez sur **"Add Domain"**

### Étape 3: Configurer "nonstop"
1. Dans le champ, tapez : `nonstop`
2. Vercel suggérera : `nonstop.vercel.app`
3. Cliquez sur **"Add"**

### Étape 4: Validation
- Attendez 1-2 minutes pour la propagation DNS
- Votre site sera accessible via : https://nonstop.vercel.app

## ✅ Résultat Final

Après configuration :
- **URL principale** : https://nonstop.vercel.app
- **URL alternative** : https://ecommerce-app-iota-lime.vercel.app (toujours fonctionnelle)
- **Nom du projet** : "Nonstop E-commerce"
- **Coût** : Toujours gratuit !

## 🔄 Mise à Jour du Nom du Projet

Pour renommer complètement le projet dans Vercel :

1. **Settings > General**
2. **Project Name** : `nonstop-ecommerce`
3. **Save Changes**

Cela changera aussi l'URL en : `nonstop-ecommerce.vercel.app`

Choisissez l'option qui vous convient le mieux ! 🎉