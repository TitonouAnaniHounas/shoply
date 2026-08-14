const BASE_URL = 'https://fakestoreapi.com'

export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products`)
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`)
  }
  return response.json()
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`)
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`)
  }
  return response.json()
}