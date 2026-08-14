import { fetchProducts, fetchCategories } from './api.js'
import { debounce, formatPrice } from './utils.js'

const ITEMS_PER_PAGE = 8

let allProducts = []
let filteredProducts = []
let visibleCount = ITEMS_PER_PAGE

// Références DOM
let grid, skeleton, errorBox, emptyBox, loadMoreBtn
let searchInput, categorySelect, sortSelect

export function initProducts() {
  grid = document.getElementById('products-grid')
  if (!grid) return // on n'est pas sur products.html, on arrête ici

  skeleton = document.getElementById('products-skeleton')
  errorBox = document.getElementById('products-error')
  emptyBox = document.getElementById('products-empty')
  loadMoreBtn = document.getElementById('load-more')
  searchInput = document.getElementById('search-input')
  categorySelect = document.getElementById('category-select')
  sortSelect = document.getElementById('sort-select')

  loadInitialData()

  searchInput.addEventListener('input', debounce(applyFilters, 300))
  categorySelect.addEventListener('change', applyFilters)
  sortSelect.addEventListener('change', applyFilters)
  loadMoreBtn.addEventListener('click', () => {
    visibleCount += ITEMS_PER_PAGE
    renderGrid()
  })
}

async function loadInitialData() {
  showSkeleton()
  try {
    const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()])
    allProducts = products
    populateCategories(categories)

    // Pré-remplir le filtre si on arrive depuis ?category=... (lien Accueil)
    const params = new URLSearchParams(window.location.search)
    const categoryFromUrl = params.get('category')
    if (categoryFromUrl) {
      categorySelect.value = categoryFromUrl
    }

    applyFilters()
  } catch (err) {
    showError()
  }
}

function populateCategories(categories) {
  categories.forEach((cat) => {
    const option = document.createElement('option')
    option.value = cat
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1)
    categorySelect.appendChild(option)
  })
}

function applyFilters() {
  const search = searchInput.value.trim().toLowerCase()
  const category = categorySelect.value
  const sort = sortSelect.value

  filteredProducts = allProducts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search)
    const matchesCategory = !category || p.category === category
    return matchesSearch && matchesCategory
  })

  filteredProducts.sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'name-asc') return a.title.localeCompare(b.title)
    if (sort === 'name-desc') return b.title.localeCompare(a.title)
    if (sort === 'rating-desc') return b.rating.rate - a.rating.rate
    return 0
  })

  visibleCount = ITEMS_PER_PAGE
  renderGrid()
}

function renderGrid() {
  hideSkeleton()
  hideError()

  if (filteredProducts.length === 0) {
    grid.innerHTML = ''
    emptyBox.classList.remove('hidden')
    loadMoreBtn.classList.add('hidden')
    return
  }

  emptyBox.classList.add('hidden')

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  grid.innerHTML = visibleProducts.map(createProductCard).join('')

  loadMoreBtn.classList.toggle('hidden', visibleCount >= filteredProducts.length)

  // Réinitialise les icônes Lucide injectées dynamiquement
  import('lucide').then(({ createIcons, Heart, Star }) => {
    createIcons({ icons: { Heart, Star }, root: grid })
  })
}

function createProductCard(product) {
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

function showSkeleton() {
  skeleton.classList.remove('hidden')
  grid.classList.add('hidden')
}

function hideSkeleton() {
  skeleton.classList.add('hidden')
  grid.classList.remove('hidden')
}

function showError() {
  hideSkeleton()
  errorBox.classList.remove('hidden')
}

function hideError() {
  errorBox.classList.add('hidden')
}