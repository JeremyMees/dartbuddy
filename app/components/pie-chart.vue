<script setup lang="ts">
import { chartColors } from '#shared/constants/charts'
import type { PieDataSet } from '~/types/charts'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Title, Tooltip, Legend)

const props = defineProps<{
  datasets: PieDataSet[]
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
    datasets: props.datasets.map((series, seriesIndex) => ({
      label: series.label,
      data: labels.map((label) => series.data[label] ?? 0),
      borderWidth: 0,
      backgroundColor:
        series.backgroundColor ??
        labels.map(
          (_, labelIndex) =>
            chartColors[(labelIndex + seriesIndex) % chartColors.length],
        ),
    })),
  }
})

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
  },
}))
</script>

<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>
