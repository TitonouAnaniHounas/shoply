export function showNotification(message) {
  const container = document.getElementById('notification-container')
  if (!container) return

  const toast = document.createElement('div')
  toast.className =
    'bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-lg text-sm transition-opacity duration-300'
  toast.textContent = message
  container.appendChild(toast)

  setTimeout(() => {
    toast.classList.add('opacity-0')
    setTimeout(() => toast.remove(), 300)
  }, 2500)
}