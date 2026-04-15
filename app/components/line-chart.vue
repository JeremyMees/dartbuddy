<script setup lang="ts">
import { chartColors } from '#shared/constants/charts'
import type { LineDataSet } from '~/types/charts'
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
  datasets: LineDataSet[]
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
      data: labels.map((label) => series.data[label] ?? null),
      borderColor:
        series.borderColor ?? chartColors[index % chartColors.length],
      pointBackgroundColor:
        series.pointBackgroundColor ??
        series.borderColor ??
        chartColors[index % chartColors.length],
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
      tension: 0.35,
      spanGaps: true,
    })),
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
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
  <Line :data="chartData" :options="chartOptions" />
</template>
