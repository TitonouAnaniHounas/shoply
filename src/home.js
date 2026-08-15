import { fetchProducts } from './api.js'
import { formatPrice } from './utils.js'
import { updateFavoriteIcons } from './favorites.js'

export async function initHomePage() {
  const grid = document.getElementById('popular-products')
  if (!grid) return // pas sur index.html

  try {
    const products = await fetchProducts()
    const popular = [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4)

    grid.innerHTML = popular.map(createCard).join('')

    const { createIcons, Heart, Star } = await import('lucide')
    createIcons({ icons: { Heart, Star }, root: grid })
    updateFavoriteIcons()
  } catch (err) {
    grid.innerHTML = '<p class="col-span-full text-center text-gray-500">Impossible de charger les produits populaires.</p>'
  }
}

function createCard(product) {
  return `
    <article class="border border-gray-200 dark:border-gray-800 rounded-lg p-5 flex flex-col hover:shadow-lg transition">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain mb-4" loading="lazy" />
        <h3 class="text-base font-medium mb-2 line-clamp-2">${product.title}</h3>
      </a>
      <p class="text-blue-600 font-bold text-lg mb-1">${formatPrice(product.price)}</p>
      <p class="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <i data-lucide="star" class="w-4 h-4 fill-yellow-400 text-yellow-400"></i> ${product.rating.rate}
      </p>
      <div class="mt-auto flex items-center justify-between">
        <button data-id="${product.id}" class="add-to-cart-btn bg-blue-600 text-white text-sm px-4 py-2.5 rounded hover:bg-blue-700 transition">
          Ajouter au panier
        </button>
        <button data-id="${product.id}" class="favorite-btn" aria-label="Ajouter aux favoris">
          <i data-lucide="heart" class="w-5 h-5"></i>
        </button>
      </div>
    </article>
  `
}