export type FilterManagerItem = {
  property: string
  type: FilterMangerType
  options?: FilterManagerItemOption[]
  label?: string
  currency?: string
  interval?: {
    min?: number
    max?: number
    increment?: number
  }
}

export type FilterMangerType =
  | 'text'
  | 'select'
  | 'multi-select'
  | 'date'
  | 'number'
  | 'range-date'
  | 'range-number'

export type FilterManagerItemOption = {
  label: string
  value: any
}

export type FilterManagerValue = Record<string, string | number | any[] | Date>
