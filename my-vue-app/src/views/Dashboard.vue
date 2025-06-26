<template>
  <div class="dashboard">
    <button class="back-btn" @click="$router.back()">← Back</button>

    <h1>Admin Account Settings</h1>
    <p>Welcome back, Admin. Here's your dashboard overview:</p>

    <div class="info-box">
      <h2>Total Registered Users</h2>
      <p>{{ userCount }} users found in the system.</p>
    </div>

    <div class="account-section">
      <h3>👤 Admin Info (Static for now)</h3>
      <p>Email: admin@example.com</p>
      <p>Role: Super Admin</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const userCount = ref(0)

const fetchUserCount = async () => {
  const snapshot = await getDocs(collection(db, 'users'))
  userCount.value = snapshot.size
}

onMounted(fetchUserCount)
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: auto;
  padding: 40px;
}

.info-box {
  background-color: #f1faff;
  padding: 24px;
  border-radius: 10px;
  margin-bottom: 24px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.account-section {
  background: #fffbe6;
  padding: 20px;
  border: 1px solid #ffecb3;
  border-radius: 10px;
}

.back-btn {
  margin-bottom: 20px;
  padding: 6px 12px;
  background-color: #ccc;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.back-btn:hover {
  background-color: #bbb;
}

</style>
