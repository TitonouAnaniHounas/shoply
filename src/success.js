export function initSuccessPage() {
  const container = document.getElementById('success-detail')
  if (!container) return // pas sur success.html

  const orderData = JSON.parse(sessionStorage.getItem('lastOrder') || 'null')

  if (!orderData) {
    container.classList.add('hidden')
    document.getElementById('success-no-order').classList.remove('hidden')
    return
  }

  document.getElementById('order-number').textContent = orderData.orderNumber
  document.getElementById('order-total').textContent = orderData.total
  sessionStorage.removeItem('lastOrder')
}