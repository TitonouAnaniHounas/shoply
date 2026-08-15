import { getCart, saveCart, addOrder } from './storage.js'
import { fetchProductById } from './api.js'
import { formatPrice } from './utils.js'

let checkoutProducts = []
let checkoutTotal = 0

export async function initCheckoutPage() {
  const form = document.getElementById('checkout-form')
  if (!form) return

  const cart = getCart()
  const emptyBox = document.getElementById('checkout-empty')
  const content = document.getElementById('checkout-content')

  if (cart.length === 0) {
    emptyBox.classList.remove('hidden')
    content.classList.add('hidden')
    return
  }

  await renderCheckoutSummary(cart)
  form.addEventListener('submit', handleSubmit)
}

async function renderCheckoutSummary(cart) {
  const container = document.getElementById('checkout-items')

  const products = await Promise.all(
    cart.map((item) => fetchProductById(item.id).then((p) => ({ ...p, quantity: item.quantity })))
  )

  checkoutProducts = products

  container.innerHTML = products
    .map(
      (p) => `
    <div class="flex justify-between text-sm py-2">
      <span>${p.title} × ${p.quantity}</span>
      <span>${formatPrice(p.price * p.quantity)}</span>
    </div>
  `
    )
    .join('')

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const shipping = subtotal > 0 ? 10 : 0
  const total = subtotal + shipping
  checkoutTotal = total

  document.getElementById('checkout-subtotal').textContent = formatPrice(subtotal)
  document.getElementById('checkout-shipping').textContent = formatPrice(shipping)
  document.getElementById('checkout-total').textContent = formatPrice(total)
}

function validateForm(data) {
  const errors = {}

  if (!data.firstName.trim()) errors.firstName = 'Le prénom est obligatoire.'
  if (!data.lastName.trim()) errors.lastName = 'Le nom est obligatoire.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Veuillez entrer un email valide.'
  if (!/^\+?[0-9\s]{8,15}$/.test(data.phone)) errors.phone = 'Veuillez entrer un numéro de téléphone valide.'
  if (!data.address.trim()) errors.address = "L'adresse est obligatoire."
  if (!data.city.trim()) errors.city = 'La ville est obligatoire.'

  return errors
}

function showErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const el = document.getElementById(`error-${field}`)
    if (el) {
      el.textContent = `❌ ${message}`
      el.classList.remove('hidden')
    }
  })
}

function clearErrors() {
  document.querySelectorAll('[id^="error-"]').forEach((el) => {
    el.textContent = ''
    el.classList.add('hidden')
  })
}

function generateOrderNumber() {
  const random = Math.floor(10000 + Math.random() * 90000)
  return `#SHOP-${random}`
}

function handleSubmit(e) {
  e.preventDefault()
  clearErrors()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData.entries())
  const errors = validateForm(data)

  if (Object.keys(errors).length > 0) {
    showErrors(errors)
    return
  }

  const orderNumber = generateOrderNumber()

  const order = {
    orderNumber,
    date: new Date().toISOString(),
    items: checkoutProducts.map((p) => ({
      id: p.id,
      title: p.title,
      image: p.image,
      price: p.price,
      quantity: p.quantity,
    })),
    total: checkoutTotal,
  }

  addOrder(order)
  sessionStorage.setItem('lastOrder', JSON.stringify({ orderNumber, total: formatPrice(checkoutTotal) }))
  saveCart([])
  window.location.href = 'success.html'
}