<template>
  <div class="product-list">
    <h2>Explore Modern Watches</h2>
    <div class="products">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="viewProduct(product.id)"
      >
        <div class="badge-row">
          <span class="badge sale">Sale 12%</span>
          <span v-if="product.stock === 0" class="badge sold-out">Sold Out</span>
        </div>

        <!-- Image from public/images folder -->
        <img :src="getImageForProduct(product.name)" :alt="product.name" class="product-image" />

        <div class="product-info">
          <h4>{{ product.brand }}</h4>
          <p class="model">[MEN] {{ product.name }}</p>
          <p class="price">
            RM {{ discountedPrice(product.price) }}
            <span class="original">RM {{ product.price.toFixed(2) }}</span>
          </p>
          <p>Stock: {{ product.stock }}</p>
          <span class="tag">Men</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const products = ref([])
const router = useRouter()

// Price discount logic
const discountedPrice = (price) => {
  return (price * 0.88).toFixed(2)
}

// Local image based on name
const getImageForProduct = (name) => {
  const lower = name.toLowerCase()
  if (lower.includes('metaretail')) return '/images/redbvlgari.jpg'
  if (lower.includes('casio')) return '/images/casio.jpg'
  if (lower.includes('g-shock')) return '/images/sportwatch.jpg'
  return '/images/image.jpg'
}

// Load data from Firestore
const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'watches'))
  products.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// Navigate to detailed view
const viewProduct = (id) => {
  router.push({ name: 'ProductView', params: { id } })
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-list {
  padding: 20px;
  background-color: #f7f7f7;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.products {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.product-card {
  background: white;
  width: 240px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-6px);
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.badge-row {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
}

.badge {
  padding: 2px 6px;
  font-size: 0.75rem;
  border-radius: 4px;
  color: white;
  font-weight: bold;
}

.sale {
  background-color: #e53935;
}

.sold-out {
  background-color: #555;
}

.product-info {
  margin-bottom: 10px;
}

.model {
  font-size: 0.95rem;
  margin: 4px 0;
  color: #333;
}

.price {
  color: #e53935;
  font-size: 1.1rem;
}

.original {
  text-decoration: line-through;
  color: #888;
  margin-left: 6px;
  font-size: 0.95rem;
}

.tag {
  display: inline-block;
  background-color: #eee;
  padding: 4px 8px;
  font-size: 0.75rem;
  margin-top: 6px;
  border-radius: 4px;
}
</style>
