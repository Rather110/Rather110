<template>
  <div class="dashboard-statistics">
    <button class="back-btn" @click="$router.back()">← Back</button>
    <h1>Stock Distribution by Brand</h1>

    <div class="summary-box">
      <p><strong>Total Brands:</strong> {{ brandCount }}</p>
      <p><strong>Total Stock:</strong> {{ totalStock }}</p>
    </div>

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

// ✅ Register chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const brandCount = ref(0)
const totalStock = ref(0)
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Stock by Brand',
      data: [],
      backgroundColor: []
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: true,
      text: 'Stock Distribution (Brand-wise)',
      font: {
        size: 16
      }
    }
  }
}

// ✅ Generate random colors for each brand
const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`

const fetchStats = async () => {
  const snapshot = await getDocs(collection(db, 'watches'))
  const stockByBrand = {}
  let total = 0

  snapshot.forEach(doc => {
    const data = doc.data()
    const brand = data.brand || 'Unknown'
    const stock = data.stock || 0

    if (!stockByBrand[brand]) stockByBrand[brand] = 0
    stockByBrand[brand] += stock
    total += stock
  })

  brandCount.value = Object.keys(stockByBrand).length
  totalStock.value = total

  chartData.value = {
    labels: Object.keys(stockByBrand),
    datasets: [
      {
        label: 'Stock by Brand',
        data: Object.values(stockByBrand),
        backgroundColor: Object.keys(stockByBrand).map(() => getRandomColor())
      }
    ]
  }
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
  font-size: 1.8rem;
}

.summary-box {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.chart-wrapper {
  height: 400px;
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
