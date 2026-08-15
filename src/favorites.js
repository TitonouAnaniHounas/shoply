import { getFavorites, saveFavorites } from './storage.js'
import { fetchProductById } from './api.js'
import { formatPrice } from './utils.js'
import { showNotification } from './notifications.js'

export function isFavorite(productId) {
  return getFavorites().includes(productId)
}

export function toggleFavorite(productId) {
  let favorites = getFavorites()

  if (favorites.includes(productId)) {
    favorites = favorites.filter((id) => id !== productId)
    saveFavorites(favorites)
    showNotification('Retiré des favoris')
  } else {
    favorites.push(productId)
    saveFavorites(favorites)
    showNotification('❤️ Ajouté aux favoris')
  }

  updateFavoriteIcons()
  renderFavoritesPage()
}

// Applique l'état rempli/vide sur chaque icône coeur visible à l'écran
export function updateFavoriteIcons() {
  document.querySelectorAll('.favorite-btn[data-id]').forEach((btn) => {
    const id = Number(btn.dataset.id)
    const svg = btn.querySelector('svg')
    if (!svg) return

    svg.classList.toggle('fill-red-500', isFavorite(id))
    svg.classList.toggle('text-red-500', isFavorite(id))
  })
}

export function initFavoritesGlobal() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.favorite-btn')
    if (btn && btn.dataset.id) {
      toggleFavorite(Number(btn.dataset.id))
    }
  })

  updateFavoriteIcons()
}

export async function renderFavoritesPage() {
  const grid = document.getElementById('favorites-grid')
  if (!grid) return // pas sur favorites.html

  const favorites = getFavorites()
  const emptyBox = document.getElementById('favorites-empty')

  if (favorites.length === 0) {
    grid.innerHTML = ''
    emptyBox.classList.remove('hidden')
    return
  }

  emptyBox.classList.add('hidden')

  const products = await Promise.all(favorites.map((id) => fetchProductById(id)))

  grid.innerHTML = products
    .map(
      (p) => `
    <article class="border border-gray-200 dark:border-gray-800 rounded-lg p-5 flex flex-col hover:shadow-lg transition">
      <a href="product.html?id=${p.id}">
        <img src="${p.image}" alt="${p.title}" class="w-full h-48 object-contain mb-4" loading="lazy" />
        <h3 class="text-base font-medium mb-2 line-clamp-2">${p.title}</h3>
      </a>
      <p class="text-blue-600 font-bold text-lg mb-4">${formatPrice(p.price)}</p>
      <div class="mt-auto flex items-center justify-between">
        <button data-id="${p.id}" class="add-to-cart-btn bg-blue-600 text-white text-sm px-4 py-2.5 rounded hover:bg-blue-700 transition">
          Ajouter au panier
        </button>
        <button data-id="${p.id}" class="favorite-btn" aria-label="Retirer des favoris">
          <i data-lucide="heart" class="w-5 h-5"></i>
        </button>
      </div>
    </article>
  `
    )
    .join('')

  const { createIcons, Heart } = await import('lucide')
  createIcons({ icons: { Heart }, root: grid })
  updateFavoriteIcons()
}