import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/shoply/',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        product: resolve(__dirname, 'product.html'),
        favorites: resolve(__dirname, 'favorites.html'),
        cart: resolve(__dirname, 'cart.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        success: resolve(__dirname, 'success.html'),
        orders: resolve(__dirname, 'orders.html'),
        about: resolve(__dirname, 'about.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
})