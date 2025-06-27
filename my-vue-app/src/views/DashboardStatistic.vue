<template>
  <div class="dashboard-statistics">
    <button class="back-btn" @click="$router.back()">← Back</button>
    <h1>Statistics</h1>

    <div class="summary-box">
      <p><strong>Total Products:</strong> {{ productCount }}</p>
      <p><strong>Total Stock:</strong> {{ stockCount }}</p>
    </div>

    <!-- Fixed-height wrapper to make Pie chart show -->
    <div class="chart-wrapper">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const productCount = ref(0)
const stockCount = ref(0)

const chartData = ref({
  labels: ['Products', 'Total Stock'],
  datasets: [
    {
      label: 'Inventory',
      data: [0, 0],
      backgroundColor: ['#42A5F5', '#66BB6A']
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const fetchStats = async () => {
  const snapshot = await getDocs(collection(db, 'watches'))
  const totalProducts = snapshot.size
  let totalStock = 0
  snapshot.forEach(doc => {
    totalStock += doc.data().stock || 0
  })

  productCount.value = totalProducts
  stockCount.value = totalStock
  chartData.value.datasets[0].data = [totalProducts, totalStock]
}

onMounted(fetchStats)
</script>

<style scoped>
.dashboard-statistics {
  padding: 30px;
  max-width: 900px;
  margin: auto;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f9ff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #133a6f;
  margin-bottom: 20px;
  font-size: 2rem;
}

.summary-box {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.chart-wrapper {
  height: 600px;  /* ✅ This gives the canvas space to render */
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.back-btn {
  background: none;
  border: none;
  color: #133a6f;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
