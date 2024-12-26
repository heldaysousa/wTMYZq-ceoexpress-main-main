import { ChartConfig, ChartConfigValue } from '../../types'

export const filterChartData = (
  chartConfigValue: ChartConfigValue,
  charts: ChartConfig[],
) => {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] // Add your desired colors here

  let filteredData =
    charts?.find(chart => chart.dataSet === chartConfigValue?.dataSet)?.data ??
    []
  Object.entries(chartConfigValue?.filtersValue ?? {}).forEach(
    ([key, value]) => {
      filteredData = filteredData.filter(item => item[`${key}`] === value)
    },
  )

  const mappedData = filteredData.map(item => {
    return {
      ...item,
      value: item?.value || 1,
    }
  })

  if (!chartConfigValue?.groupBy) {
    return mappedData
  }

  let groupedData = mappedData.filter(item => !!item[chartConfigValue?.groupBy])

  groupedData = groupedData.reduce((acc, item) => {
    const key = item[chartConfigValue.groupBy]
    if (!acc[key]) {
      acc[key] = {
        ...item,
        name: key,
        value: 0,
        fill: item.fill ?? colors[Object.keys(acc).length % colors.length],
      }
    }
    acc[key].value += item.value
    return acc
  }, {})

  return Object.values(groupedData)
}
