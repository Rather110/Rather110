<template>
  <div class="product-view">
    <!-- Back Button -->
    <button class="back-btn" @click="goBack">← Back</button>

    <div v-if="product">
      <h2>{{ product.name }}</h2>

      <!-- Product Image -->
      <img :src="getImage(product.name)" :alt="product.name" class="product-img" />

      <!-- Product Info -->
      <p><strong>Brand:</strong> {{ product.brand }}</p>
      <p><strong>Price:</strong> RM {{ product.price.toFixed(2) }}</p>
      <p><strong>Stock Available:</strong> {{ product.stock }}</p>

      <!-- 3D Visualization -->
      <h3>3D View:</h3>
      <iframe
        v-if="product.visualizationUrl"
        :src="product.visualizationUrl"
        width="100%"
        height="400"
        frameborder="0"
        allowfullscreen
      ></iframe>

      <!-- Buy Button -->
      <div class="button-container">
        <button
          class="buy-btn"
          :disabled="product.stock === 0"
          @click="buyProduct"
        >
          🛒 {{ product.stock === 0 ? 'SOLD OUT' : 'BUY NOW' }}
        </button>
      </div>
    </div>

    <div v-else>
      <p>Loading product details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useCartStore } from '../stores/cart' // ✅ Import Cart Store

const route = useRoute()
const router = useRouter()
const product = ref(null)
const cartStore = useCartStore() // ✅ Initialize cart store

const getImage = (name) => {
  const lower = name.toLowerCase()
  if (lower.includes('metaretail')) return '/images/redbvlgari.jpg'
  if (lower.includes('casio')) return '/images/casio.jpg'
  if (lower.includes('g-shock')) return '/images/sportwatch.jpg'
  if (lower.includes('bvlgari')) return '/images/bvlgari.jpg'
  if (lower.includes('test1')) return '/images/modernwatch.png'
  return '/images/default.jpg'
}

const fetchProduct = async () => {
  const productId = route.params.id
  const productRef = doc(db, 'watches', productId)
  const docSnap = await getDoc(productRef)

  if (docSnap.exists()) {
    product.value = { id: docSnap.id, ...docSnap.data() }
  }
}

const buyProduct = async () => {
  if (product.value.stock > 0) {
    // ✅ Decrease stock in Firestore
    const productRef = doc(db, 'watches', product.value.id)
    await updateDoc(productRef, { stock: product.value.stock - 1 })
    product.value.stock -= 1

    // ✅ Add to Cart Store
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: getImage(product.value.name)
    })
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.product-view {
  padding: 30px;
  max-width: 800px;
  margin: auto;
  font-family: 'Segoe UI', sans-serif;
  background-color: #fdfdfd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: transparent;
  border: none;
  font-size: 1rem;
  color: #133a6f;
  cursor: pointer;
  font-weight: bold;
}

h2 {
  color: #133a6f;
  margin-top: 50px;
  margin-bottom: 20px;
}

.product-img {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  margin-bottom: 20px;
}

p {
  font-size: 1rem;
  margin-bottom: 10px;
}

iframe {
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-top: 10px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.buy-btn {
  background-color: #133a6f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.buy-btn[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
