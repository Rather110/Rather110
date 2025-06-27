<template>
  <div class="homepage">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="top-actions">
        <img src="/images/cart.png" alt="Cart" class="icon cart-icon" @click="goToCart" />
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-filter">
      <input v-model="searchQuery" type="text" placeholder="Search watches..." />
      <select v-model="selectedCategory">
        <option value="">All Categories</option>
        <option value="modern">Modern Watch</option>
        <option value="sport">Sport Watch</option>
      </select>
    </div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-text">
        <h1>Timeless Luxury Watches</h1>
        <p>Explore the finest collection of modern and sport watches built for style and performance.</p>
        <button @click="explore">Explore Collection</button>
      </div>
      <img src="/images/herobanner.jpg" alt="Hero Watch" class="hero-image" />
    </section>

    <!-- Collections Section -->
    <section class="collections">
      <div
        v-for="watch in filteredWatches"
        :key="watch.title"
        class="collection-card"
        @click="viewProduct(watch)"
      >
        <img :src="watch.image" :alt="watch.title" />
        <h3>{{ watch.title }}</h3>
        <p>{{ watch.description }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

// Router
const router = useRouter()

// Actions
const logout = async () => {
  await signOut(auth)
  router.push('/login')
}

const goToCart = () => {
  router.push('/cart')
}

const explore = () => {
  router.push('/products')
}

const viewProduct = (watch) => {
  router.push({
    name: 'ProductView',
    params: {
      id: encodeURIComponent(watch.title),
      data: JSON.stringify(watch),
    },
  })
}

// Sample Watches
const watches = ref([
  {
    title: 'Modern Watch',
    category: 'modern',
    description: 'Bold design for the new era.',
    image: '/images/modernwatch.png',
  },
  {
    title: 'Sport Watch',
    category: 'sport',
    description: 'Rugged performance and durability.',
    image: '/images/sportwatch.jpg',
  },
])

// Filters
const searchQuery = ref('')
const selectedCategory = ref('')

const filteredWatches = computed(() => {
  return watches.value.filter((watch) => {
    const matchesSearch = watch.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value
      ? watch.category === selectedCategory.value
      : true
    return matchesSearch && matchesCategory
  })
})
</script>

<style scoped>
.homepage {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to right, #d3cce3, #e9e4f0);
  color: #1a1a1a;
  padding: 20px;
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.top-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}
.icon {
  width: 28px;
  height: 28px;
  cursor: pointer;
}
.logout-btn {
  background-color: #133a6f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.logout-btn:hover {
  background-color: #0b2652;
}

/* Search and Filter */
.search-filter {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 30px;
}
.search-filter input,
.search-filter select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #aaa;
  width: 200px;
  font-size: 1rem;
}

/* Hero Section */
.hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 40px 20px;
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 40px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
.hero-text {
  max-width: 500px;
}
.hero-text h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #133a6f;
}
.hero-text p {
  font-size: 1.1rem;
  margin-bottom: 20px;
}
.hero-text button {
  padding: 12px 24px;
  background-color: #133a6f;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.hero-text button:hover {
  background-color: #0b2652;
}
.hero-image {
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
}

/* Collections */
.collections {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}
.collection-card {
  background-color: white;
  padding: 20px;
  border-radius: 16px;
  width: 260px;
  text-align: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;
  cursor: pointer;
}
.collection-card:hover {
  transform: translateY(-8px);
}
.collection-card img {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 15px;
}
.collection-card h3 {
  color: #133a6f;
  margin-bottom: 8px;
}
</style>
