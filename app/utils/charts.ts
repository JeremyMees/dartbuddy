import type { Chart } from 'chart.js'

export function chartCenterTextPlugin(
  chart: Chart<'doughnut', number[], unknown>,
  centerText?: string,
  centerSubtext?: string,
) {
  if (!centerText) return

  const {
    ctx,
    chartArea: { width, height, left, top },
  } = chart
  const centerX = left + width / 2
  const centerY = top + height / 2

  ctx.save()

  ctx.font = 'bold 4rem sans-serif'
  ctx.fillStyle = '#c3c0b6'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const mainY = centerSubtext ? centerY - 12 : centerY
  ctx.fillText(centerText, centerX, mainY)

  if (centerSubtext) {
    ctx.font = '1rem sans-serif'
    ctx.fillStyle = '#b7b5a9'
    ctx.fillText(centerSubtext, centerX, centerY + 30)
  }

  ctx.restore()
}
