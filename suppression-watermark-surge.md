# Supprimer le watermark Surge (N en bas à gauche)

## Options disponibles :

### 1. Nom de domaine personnalisé (RECOMMANDÉ)
```bash
surge . votre-domaine.com
```
Cela supprime automatiquement le watermark.

### 2. Plan payant Surge
- Plan "Surge Pro" à $30/mois
- Supprime tous les watermarks

### 3. Alternatives de déploiement
- **Vercel** (recommandé pour Next.js)
- **Netlify** (gratuit avec nom de domaine personnalisé)
- **GitHub Pages**
- **Railway**

### 4. CSS personnalisé (solution temporaire)
Si vous voulez masquer temporairement le watermark :
```css
/* Dans votre globals.css */
.surge-watermark, .surge-logo, [class*="surge"] {
  display: none !important;
}
```

## Recommandation
Utilisez un nom de domaine personnalisé avec Vercel ou Netlify pour un déploiement Next.js optimal et gratuit.