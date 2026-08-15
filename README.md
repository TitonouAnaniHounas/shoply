# Shoply 🛒

Boutique en ligne front-end réalisée en JavaScript vanilla, connectée à une API publique de produits. Projet de démonstration construit pour mon portfolio — aucune transaction réelle n'y est effectuée.

🔗 **Démo en ligne :** https://titonouananihounas.github.io/shoply/


## ✨ Fonctionnalités

- **Catalogue** — recherche en temps réel (avec debounce), filtres par catégorie, tri (prix, nom, note), pagination "Charger plus"
- **Fiche produit** — détails complets, sélection de quantité, produits similaires
- **Panier** — ajout/suppression, gestion des quantités, calcul automatique du sous-total, livraison et total, persistance via `localStorage`
- **Favoris** — ajout/retrait synchronisé sur toutes les pages, persistance via `localStorage`
- **Checkout** — formulaire avec validation complète (email, téléphone, champs obligatoires), simulation de commande
- **Historique des commandes** — chaque commande passée est sauvegardée localement et consultable
- **Dark mode** — bascule clair/sombre avec persistance
- **Responsive** — menu mobile, grilles adaptatives (mobile, tablette, desktop)
- **Notifications** — retours visuels (ajout panier, favoris, suppression, erreurs)
- **États UX** — loaders (skeleton), gestion des erreurs API, états vides

## 🛠️ Stack technique

| Élément | Choix |
|---|---|
| Structure | HTML5 sémantique |
| Style | Tailwind CSS v4 |
| Logique | JavaScript vanilla (ES6+, modules) |
| Icônes | Lucide |
| Données | [Fake Store API](https://fakestoreapi.com) |
| Build | Vite |
| Persistance | localStorage / sessionStorage |

## 📁 Structure du projet

shoply/
├── index.html # Accueil
├── products.html # Catalogue
├── product.html # Détail produit
├── favorites.html # Favoris
├── cart.html # Panier
├── checkout.html # Commande
├── success.html # Confirmation
├── orders.html # Historique des commandes
├── about.html # À propos / Contact / FAQ / Légal
├── 404.html # Page introuvable
│
├── src/
│ ├── main.js # Point d'entrée, initialisation globale
│ ├── api.js # Appels à la Fake Store API
│ ├── products.js # Logique du catalogue
│ ├── product.js # Logique de la fiche produit
│ ├── cart.js # Logique du panier
│ ├── favorites.js # Logique des favoris
│ ├── checkout.js # Logique du formulaire de commande
│ ├── success.js # Logique de la page de confirmation
│ ├── orders.js # Logique de l'historique
│ ├── home.js # Produits populaires (Accueil)
│ ├── storage.js # Accès localStorage/sessionStorage
│ ├── notifications.js # Toasts
│ ├── utils.js # Fonctions utilitaires (debounce, formatPrice)
│ └── style.css # Import Tailwind
│
└── vite.config.js


## 🚀 Installation

```bash
git clone https://github.com/TitonouAnaniHounas/shoply.git
cd shoply
npm install
npm run dev
```

Le site est ensuite accessible sur `http://localhost:5173`.

## 📦 Build de production

```bash
npm run build
```

## 📝 Notes

Ce projet est **entièrement front-end** : aucune authentification réelle, aucun paiement réel, aucune donnée n'est envoyée à un serveur. Toutes les données affichées (produits, prix, avis) proviennent de la Fake Store API, une API publique gratuite destinée aux tests. Les données personnelles (panier, favoris, historique) restent stockées localement dans le navigateur.

## 👤 Auteur

**Hounas** — [GitHub](https://github.com/TitonouAnaniHounas) · [WhatsApp](https://wa.me+2250151583623)