import { getOrders } from './storage.js'
import { formatPrice } from './utils.js'

export function initOrdersPage() {
  const container = document.getElementById('orders-list')
  if (!container) return // pas sur orders.html

  const orders = getOrders()
  const emptyBox = document.getElementById('orders-empty')

  if (orders.length === 0) {
    container.innerHTML = ''
    emptyBox.classList.remove('hidden')
    return
  }

  emptyBox.classList.add('hidden')

  container.innerHTML = orders
    .map(
      (order) => `
    <div class="border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <p class="font-bold">${order.orderNumber}</p>
          <p class="text-sm text-gray-500">${formatDate(order.date)}</p>
        </div>
        <p class="font-bold text-blue-600">${formatPrice(order.total)}</p>
      </div>
      <div class="space-y-2">
        ${order.items
          .map(
            (item) => `
          <div class="flex items-center gap-3 text-sm">
            <img src="${item.image}" alt="${item.title}" class="w-10 h-10 object-contain" />
            <span class="flex-1 line-clamp-1">${item.title}</span>
            <span class="text-gray-500">× ${item.quantity}</span>
            <span class="w-16 text-right">${formatPrice(item.price * item.quantity)}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `
    )
    .join('')
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}