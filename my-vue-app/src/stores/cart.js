import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])

  const addToCart = (product) => {
    const existingItem = cartItems.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.value.push({ ...product, quantity: 1 })
    }
  }

  const removeFromCart = (id) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
  }

  const clearCart = () => {
    cartItems.value = []
  }

  return { cartItems, addToCart, removeFromCart, clearCart }
})
