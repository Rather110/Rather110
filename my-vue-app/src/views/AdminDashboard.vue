<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <p>Welcome, Admin! Use the sections below to manage the store.</p>

    <button class="logout-btn" @click="logout">🚪 Logout</button>

    <div class="summary">
      <p><strong>Total Products:</strong> {{ productCount }}</p>
      <p><strong>Total Stock:</strong> {{ stockCount }}</p>
      <p><strong>Total Users:</strong> {{ userCount }}</p>
    </div>

    <nav class="nav-grid">
      <router-link to="/add" class="nav-card">
        <h2>📦 Manage Products</h2>
        <p>View, create, and delete watch listings</p>
      </router-link>

      <router-link to="/statistic" class="nav-card">
        <h2>📊 View Statistics</h2>
        <p>See sales and stock trends</p>
      </router-link>

      <router-link to="/account" class="nav-card">
        <h2>⚙️ Admin Settings</h2>
        <p>Manage account and view user count</p>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'           // ⬅️ Import router
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const router = useRouter()                       // ⬅️ Use router instance

const productCount = ref(0)
const stockCount = ref(0)
const userCount = ref(0)

const fetchDashboardSummary = async () => {
  const productSnapshot = await getDocs(collection(db, 'watches'))
  productCount.value = productSnapshot.size
  stockCount.value = 0
  productSnapshot.forEach(doc => {
    stockCount.value += doc.data().stock || 0
  })

  const userSnapshot = await getDocs(collection(db, 'users'))
  userCount.value = userSnapshot.size
}

const logout = () => {
  // You can add Firebase Auth signOut() here if using authentication
  alert('Logged out!')
  router.push('/login')       // ⬅️ Redirect to /login
}

onMounted(fetchDashboardSummary)
</script>

<style scoped>
.admin-dashboard {
  padding: 40px;
  text-align: center;
  max-width: 900px;
  margin: auto;
}

.logout-btn {
  float: right;
  padding: 6px 14px;
  background-color: crimson;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.logout-btn:hover {
  background-color: #a00000;
}


.summary {
  background: #eef7fa;
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  text-align: left;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.nav-card {
  display: block;
  padding: 20px;
  background-color: #f6f8fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
}
.nav-card:hover {
  background-color: #e0f7ff;
  transform: scale(1.02);
}

</style>
