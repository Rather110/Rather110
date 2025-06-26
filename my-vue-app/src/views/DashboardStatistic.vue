<template>
  <div class="dashboard-statistics">
    <button class="back-btn" @click="$router.back()">← Back</button>
    <h1>Statistics</h1>

    <div class="summary-box">
      <p><strong>Total Products:</strong> {{ productCount }}</p>
      <p><strong>Total Stock:</strong> {{ stockCount }}</p>
    </div>

    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const productCount = ref(0)
const stockCount = ref(0)

const chartData = ref({
  labels: ['Products', 'Stock'],
  datasets: [
    {
      label: 'Statistics',
      data: [0, 0], // placeholder
      backgroundColor: ['#42A5F5', '#66BB6A']
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const fetchStats = async () => {
  const snapshot = await getDocs(collection(db, 'watches'))
  productCount.value = snapshot.size
  stockCount.value = 0
  snapshot.forEach(doc => {
    stockCount.value += doc.data().stock || 0
  })
  chartData.value.datasets[0].data = [productCount.value, stockCount.value]
}

onMounted(fetchStats)
</script>
