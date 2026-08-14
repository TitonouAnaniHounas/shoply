import './style.css'
import { createIcons, Menu, X, Heart, ShoppingCart, Moon, Sun, Star } from 'lucide'
import { initProducts } from './products.js'
createIcons({
  icons: { Menu, X, Heart, ShoppingCart, Moon, Sun, Star },
})

// --- DARK MODE ---
const html = document.documentElement
const themeToggle = document.getElementById('theme-toggle')

if (localStorage.getItem('theme') === 'dark') {
  html.classList.add('dark')
}

themeToggle.addEventListener('click', () => {
  html.classList.toggle('dark')
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light')
})

// --- MENU MOBILE ---
const menuToggle = document.getElementById('menu-toggle')
const mobileMenu = document.getElementById('mobile-menu')
const menuIcon = document.getElementById('menu-icon')
const closeIcon = document.getElementById('close-icon')

menuToggle.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.contains('hidden')

  mobileMenu.classList.toggle('hidden', !isHidden)
  mobileMenu.classList.toggle('flex', isHidden)
  menuIcon.classList.toggle('hidden', isHidden)
  closeIcon.classList.toggle('hidden', !isHidden)
  menuToggle.setAttribute('aria-expanded', String(isHidden))
})

initProducts()