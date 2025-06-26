
<template>
  <div class="dashboard-add">
    <h1>Manage Watches</h1>
<button class="back-btn" @click="$router.back()">← Back</button>

    <!-- Add Watch Form -->
    <form @submit.prevent="addWatch" class="form">
      <input v-model="newWatch.name" type="text" placeholder="Name" required />
      <input v-model="newWatch.brand" type="text" placeholder="Brand" required />
      <input v-model.number="newWatch.price" type="number" placeholder="Price" required />
      <input v-model.number="newWatch.stock" type="number" placeholder="Stock" required />
      <input v-model="newWatch.imageUrl" type="text" placeholder="Image URL" required />
      <input v-model="newWatch.visualizationUrl" type="text" placeholder="3D Model URL (Embed)" required />
      <button type="submit">Add Product</button>
    </form>

    <!-- Watch List Table -->
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(watch, id) in watches" :key="id">
          <td>{{ watch.name }}</td>
          <td>{{ watch.brand }}</td>
          <td>${{ watch.price }}</td>
          <td>{{ watch.stock }}</td>
          <td>
            <button @click="deleteWatch(id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'

const watches = ref({})
const newWatch = ref({
  name: '',
  brand: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  visualizationUrl: ''
})

const fetchWatches = async () => {
  const snapshot = await getDocs(collection(db, 'watches'))
  watches.value = {}
  snapshot.forEach(docSnap => {
    watches.value[docSnap.id] = docSnap.data()
  })
}

const addWatch = async () => {
  try {
    await addDoc(collection(db, 'watches'), newWatch.value)
    alert('Watch added!')
    newWatch.value = { name: '', brand: '', price: 0, stock: 0, imageUrl: '', visualizationUrl: '' }
    fetchWatches()
  } catch (err) {
    console.error('Add failed:', err)
    alert('Failed to add watch.')
  }
}

const deleteWatch = async (id) => {
  try {
    await deleteDoc(doc(db, 'watches', id))
    alert('Watch deleted!')
    fetchWatches()
  } catch (err) {
    console.error('Delete failed:', err)
    alert('Failed to delete watch.')
  }
}

onMounted(fetchWatches)
</script>

<style scoped>
.dashboard-add {
  padding: 40px;
  max-width: 1000px;
  margin: auto;
}

.form {
  display: grid;
  gap: 10px;
  margin-bottom: 30px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.form input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.form button {
  grid-column: span 2;
  padding: 10px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  border: 1px solid #ccc;
  text-align: center;
}

button {
  padding: 6px 12px;
  background-color: crimson;
  color: white;
  border: none;
  cursor: pointer;
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
