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

type LineSeries = {
  label: string
  data: Record<string, number>
  borderColor?: string
  pointBackgroundColor?: string
  sort?: (a: [string, number], b: [string, number]) => number
}

const props = defineProps<{
  data?: Record<string, number>
  datasets?: LineSeries[]
  xLabel: string
  yLabel: string
  datasetLabel?: string
  sort?: (a: [string, number], b: [string, number]) => number
}>()

const colors = ['#D97757', '#9c87f5', '#1a1915', '#2f2b48', '#b4552d']

const normalizedDatasets = computed<LineSeries[]>(() => {
  if (props.datasets?.length) return props.datasets

  return [
    {
      label: props.datasetLabel ?? '',
      data: props.data ?? {},
      borderColor: colors[0],
      pointBackgroundColor: colors[0],
      sort: props.sort,
    },
  ]
})

const chartData = computed(() => {
  const sortedEntriesBySeries = normalizedDatasets.value.map((series) => {
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
    datasets: normalizedDatasets.value.map((series, index) => ({
      label: series.label,
      data: labels.map((label) => series.data[label] ?? null),
      borderColor: series.borderColor ?? colors[index % colors.length],
      pointBackgroundColor:
        series.pointBackgroundColor ??
        series.borderColor ??
        colors[index % colors.length],
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
      display: normalizedDatasets.value.length > 1,
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
