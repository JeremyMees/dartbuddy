<script setup lang="ts">
import { chartColors } from '#shared/constants/charts'
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
  datasets: BarDataSet[]
  xLabel: string
  yLabel: string
}>()

const chartData = computed(() => {
  const sortedEntriesBySeries = props.datasets.map((series) => {
    const entries = Object.entries(series.data)
    if (series.sort) entries.sort(series.sort)
    return entries
  })

  const labels = Array.from(
    new Set(
      sortedEntriesBySeries.flatMap((entries) =>
        entries.map(([label]) => label),
      ),
    ),
  )

  return {
    labels,
    datasets: props.datasets.map((series, index) => ({
      label: series.label,
      data: labels.map((label) => series.data[label] ?? 0),
      backgroundColor:
        series.backgroundColor ?? chartColors[index % chartColors.length],
      borderRadius: 8,
    })),
  }
})

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: props.datasets.length > 1,
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
}))
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
