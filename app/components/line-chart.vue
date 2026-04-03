<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
)

const props = defineProps<{
  data: Record<string, number>
  xLabel: string
  yLabel: string
  datasetLabel?: string
  sort?: (a: [string, number], b: [string, number]) => number
}>()

const chartData = computed(() => {
  let entries = Object.entries(props.data)

  if (props.sort) {
    entries = entries.sort(props.sort)
  }

  const labels = entries.map(([label]) => label)
  const values = entries.map(([, value]) => value)

  return {
    labels,
    datasets: [
      {
        label: props.datasetLabel ?? '',
        data: values,
        borderColor: '#D97757',
        backgroundColor: 'rgba(217,119,87,0.08)',
        pointBackgroundColor: '#D97757',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: true,
        tension: 0.35,
      },
    ],
  }
})

const chartOptions: ChartOptions<'line'> = {
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
  <Line :data="chartData" :options="chartOptions" />
</template>
