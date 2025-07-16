<template>
  <div class="cart-container">
    <!-- Cart Button -->
    <button class="cart-btn" @click="toggleCart">
      🛒 Cart ({{ cartStore.cartItems.length }})
    </button>

    <!-- Dropdown Cart -->
    <div v-if="isOpen" class="cart-dropdown">
      <h3>Your Cart</h3>
      <div v-if="cartStore.cartItems.length > 0">
        <div
          v-for="item in cartStore.cartItems"
          :key="item.id"
          class="cart-item"
        >
          <img :src="item.image" class="cart-img" alt="product" />
          <div class="cart-info">
            <p class="cart-name">{{ item.name }}</p>
            <p class="cart-price">RM {{ (item.price * item.quantity).toFixed(2) }}</p>
            <p class="cart-quantity">Qty: {{ item.quantity }}</p>
          </div>
          <button class="remove-btn" @click="cartStore.removeFromCart(item.id)">
            ✖
          </button>
        </div>

        <div class="cart-total">
          <strong>Total: RM {{ totalPrice.toFixed(2) }}</strong>
        </div>
        <button class="checkout-btn">Proceed to Checkout</button>
      </div>
      <p v-else>Your cart is empty.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const isOpen = ref(false)

const toggleCart = () => {
  isOpen.value = !isOpen.value
}

const totalPrice = computed(() =>
  cartStore.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
)
</script>

<style scoped>
.cart-container {
  position: relative;
  display: inline-block;
}

.cart-btn {
  background-color: #133a6f;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.cart-dropdown {
  position: absolute;
  right: 0;
  top: 50px;
  width: 300px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 15px;
  z-index: 100;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.cart-img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  object-fit: cover;
}

.cart-info {
  flex: 1;
  margin-left: 10px;
}

.cart-name {
  font-size: 0.9rem;
  font-weight: bold;
}

.cart-price,
.cart-quantity {
  font-size: 0.8rem;
  color: #555;
}

.remove-btn {
  background: transparent;
  border: none;
  color: red;
  cursor: pointer;
}

.cart-total {
  text-align: right;
  margin-top: 10px;
}

.checkout-btn {
  width: 100%;
  background-color: #133a6f;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
