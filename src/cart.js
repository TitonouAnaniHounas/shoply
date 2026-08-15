import { getCart, saveCart } from './storage.js'
import { fetchProductById } from './api.js'
import { formatPrice } from './utils.js'
import { showNotification } from './notifications.js'

export function addToCart(productId, qty = 1) {
  const cart = getCart()
  const existing = cart.find((item) => item.id === productId)

  if (existing) {
    existing.quantity += qty
  } else {
    cart.push({ id: productId, quantity: qty })
  }

  saveCart(cart)
  updateCartCount()
  showNotification('✅ Produit ajouté au panier')
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId)
  saveCart(cart)
  updateCartCount()
  renderCartPage()
  showNotification('🗑️ Produit supprimé du panier')
}

export function updateQuantity(productId, delta) {
  const cart = getCart()
  const item = cart.find((i) => i.id === productId)
  if (!item) return

  item.quantity += delta
  if (item.quantity <= 0) {
    removeFromCart(productId)
    return
  }

  saveCart(cart)
  updateCartCount()
  renderCartPage()
}

export function clearCart() {
  saveCart([])
  updateCartCount()
  renderCartPage()
  showNotification('🗑️ Panier vidé')
}

export function updateCartCount() {
  const cart = getCart()
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  document.querySelectorAll('#cart-count').forEach((el) => {
    el.textContent = totalItems
  })
}

// Actif sur toutes les pages : compteur + écoute globale des boutons "Ajouter au panier"
export function initCartGlobal() {
  updateCartCount()

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn')
    if (btn) {
      const qty = Number(btn.dataset.quantity) || 1
      addToCart(Number(btn.dataset.id), qty)
    }
  })
}

export async function renderCartPage() {
  const container = document.getElementById('cart-items')
  if (!container) return // pas sur cart.html

  const cart = getCart()
  const emptyBox = document.getElementById('cart-empty')
  const summaryBox = document.getElementById('cart-summary')

  if (cart.length === 0) {
    container.innerHTML = ''
    emptyBox.classList.remove('hidden')
    summaryBox.classList.add('hidden')
    return
  }

  emptyBox.classList.add('hidden')
  summaryBox.classList.remove('hidden')

  const products = await Promise.all(
    cart.map((item) =>
      fetchProductById(item.id).then((product) => ({ ...product, quantity: item.quantity }))
    )
  )

  container.innerHTML = products
    .map(
      (p) => `
    <div class="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 py-4">
      <img src="${p.image}" alt="${p.title}" class="w-16 h-16 object-contain" />
      <div class="flex-1">
        <p class="font-medium line-clamp-1">${p.title}</p>
        <p class="text-sm text-gray-500">${formatPrice(p.price)}</p>
      </div>
      <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
        <button data-id="${p.id}" data-delta="-1" class="qty-btn px-3 py-1" aria-label="Diminuer">-</button>
        <span class="px-3">${p.quantity}</span>
        <button data-id="${p.id}" data-delta="1" class="qty-btn px-3 py-1" aria-label="Augmenter">+</button>
      </div>
      <p class="font-bold w-20 text-right">${formatPrice(p.price * p.quantity)}</p>
      <button data-id="${p.id}" class="remove-btn text-red-500" aria-label="Supprimer">
        <i data-lucide="trash-2" class="w-5 h-5"></i>
      </button>
    </div>
  `
    )
    .join('')

  import('lucide').then(({ createIcons, Trash2 }) => {
    createIcons({ icons: { Trash2 }, root: container })
  })

  renderSummary(products)
}

function renderSummary(products) {
  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const shipping = subtotal > 0 ? 10 : 0
  const total = subtotal + shipping
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)

  document.getElementById('cart-subtotal').textContent = formatPrice(subtotal)
  document.getElementById('cart-shipping').textContent = formatPrice(shipping)
  document.getElementById('cart-total').textContent = formatPrice(total)
  document.getElementById('cart-item-count').textContent = totalItems
}

// Actif uniquement sur cart.html
export function initCartPage() {
  const container = document.getElementById('cart-items')
  if (!container) return

  renderCartPage()

  container.addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('.qty-btn')
    if (qtyBtn) {
      updateQuantity(Number(qtyBtn.dataset.id), Number(qtyBtn.dataset.delta))
      return
    }

    const removeBtn = e.target.closest('.remove-btn')
    if (removeBtn) {
      removeFromCart(Number(removeBtn.dataset.id))
    }
  })

  const clearBtn = document.getElementById('clear-cart-btn')
  const modal = document.getElementById('clear-cart-modal')

  clearBtn.addEventListener('click', () => modal.classList.remove('hidden'))
  document.getElementById('clear-cart-cancel').addEventListener('click', () => modal.classList.add('hidden'))
  document.getElementById('clear-cart-confirm').addEventListener('click', () => {
    clearCart()
    modal.classList.add('hidden')
  })
}