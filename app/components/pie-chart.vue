<script setup lang="ts">
import { chartColors } from '#shared/constants/charts'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartOptions,
  type Plugin,
} from 'chart.js'

ChartJS.register(ArcElement, Title, Tooltip, Legend)

const props = defineProps<{
  datasets: PieDataSet[]
  centerText?: string
  centerSubtext?: string
}>()

const centerTextPlugin = computed<Plugin<'doughnut'>>(() => ({
  id: 'centerText',
  afterDraw(chart) {
    chartCenterTextPlugin(chart, props.centerText, props.centerSubtext)
  },
}))

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
  cutout: '70%',
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
  },
}))
</script>

<template>
  <Doughnut
    :data="chartData"
    :options="chartOptions"
    :plugins="[centerTextPlugin]"
  />
</template>
