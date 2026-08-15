const CART_KEY = 'cart'

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}
const FAVORITES_KEY = 'favorites'

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []
  } catch {
    return []
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}
const ORDERS_KEY = 'orders'

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []
  } catch {
    return []
  }
}

export function addOrder(order) {
  const orders = getOrders()
  orders.unshift(order) // la plus récente en premier
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}