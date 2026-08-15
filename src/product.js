import { fetchProductById, fetchProductsByCategory } from './api.js'
import { formatPrice } from './utils.js'
import { updateFavoriteIcons } from './favorites.js'

let quantity = 1
let currentProduct = null

export function initProduct() {
  const container = document.getElementById('product-detail')
  if (!container) return // pas sur product.html, on arrête

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')

  if (!id) {
    showError()
    return
  }

  loadProduct(id)
}

async function loadProduct(id) {
  const loading = document.getElementById('product-loading')
  const container = document.getElementById('product-detail')

  loading.classList.remove('hidden')
  container.classList.add('hidden')

  try {
    currentProduct = await fetchProductById(id)
    renderProduct(currentProduct)
    loadSimilarProducts(currentProduct.category, currentProduct.id)
  } catch (err) {
    showError()
  } finally {
    loading.classList.add('hidden')
  }
}

function renderProduct(product) {
  const container = document.getElementById('product-detail')
  container.classList.remove('hidden')

  document.title = `${product.title} — Shoply`

  document.getElementById('product-image').src = product.image
  document.getElementById('product-image').alt = product.title
  document.getElementById('product-title').textContent = product.title
  document.getElementById('product-rating').textContent = `${product.rating.rate} (${product.rating.count} avis)`
  document.getElementById('product-price').textContent = formatPrice(product.price)
  document.getElementById('product-description').textContent = product.description
  document.getElementById('product-category').textContent = product.category

  document.getElementById('add-to-cart-btn').dataset.id = product.id
  document.getElementById('add-to-cart-btn').dataset.quantity = 1
  document.getElementById('favorite-btn-detail').dataset.id = product.id

  quantity = 1
  document.getElementById('quantity-value').textContent = quantity
  updateFavoriteIcons()
}

async function loadSimilarProducts(category, excludeId) {
  const grid = document.getElementById('similar-products')
  try {
    const products = await fetchProductsByCategory(category)
    const similar = products.filter((p) => p.id !== Number(excludeId)).slice(0, 4)

    grid.innerHTML = similar.map((p) => `
      <a href="product.html?id=${p.id}" class="border border-gray-200 dark:border-gray-800 rounded-lg p-5 flex flex-col hover:shadow-lg transition">
        <img src="${p.image}" alt="${p.title}" class="w-full h-40 object-contain mb-4" loading="lazy" />
        <h3 class="text-sm font-medium mb-2 line-clamp-2">${p.title}</h3>
        <p class="text-blue-600 font-bold">${formatPrice(p.price)}</p>
      </a>
    `).join('')
  } catch (err) {
    grid.innerHTML = ''
  }
}

function showError() {
  document.getElementById('product-loading').classList.add('hidden')
  document.getElementById('product-error').classList.remove('hidden')
}

// Boutons quantité — attachés une seule fois au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  const decreaseBtn = document.getElementById('quantity-decrease')
  const increaseBtn = document.getElementById('quantity-increase')
  const quantityValue = document.getElementById('quantity-value')
  const addToCartBtn = document.getElementById('add-to-cart-btn')

  if (!decreaseBtn) return

  function syncQuantity() {
    quantityValue.textContent = quantity
    addToCartBtn.dataset.quantity = quantity
  }

  decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--
      syncQuantity()
    }
  })

  increaseBtn.addEventListener('click', () => {
    quantity++
    syncQuantity()
  })
})