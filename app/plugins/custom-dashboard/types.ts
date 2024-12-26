import { FilterManagerItem, FilterManagerValue } from '../filter-manager'

export type ChartConfig = {
  dataSet?: string
  data?: any[]
  groupBy?: { label: string; value: string }[]
  filters?: FilterManagerItem[]
}

export type ChartConfigValue = {
  dataSet?: string
  title?: string
  id?: string
  filtersValue?: FilterManagerValue[]
  type?: 'pie' | 'line' | 'bar' | 'number'
  groupBy?: string
  order?: number
}
