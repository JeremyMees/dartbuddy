<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  data: Record<string, number>
  xLabel: string
  yLabel: string
  datasetLabel?: string
}>()

const chartData = computed(() => {
  const labels = Object.keys(props.data)
  const values = Object.values(props.data)

  return {
    labels,
    datasets: [
      {
        label: props.datasetLabel ?? '',
        data: values,
        backgroundColor: '#D97757',
        borderColor: '#D97757',
        borderRadius: 8,
      },
    ],
  }
})

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: props.xLabel,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
      title: {
        display: true,
        text: props.yLabel,
      },
    },
  },
}
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
