# Filter Manager

The Filter Manager is a component that provides a flexible filtering interface.

## Features

- Multiple filter types supported:
  - Text
  - Select (single)
  - Multi-select
  - Date
  - Range Date
  - Number
  - Range Number
- Currency formatting support
- Debounced filter updates
- Modal interface with clear/save actions
- Badge showing active filter count

## Props

| Prop     | Type                                | Description                     |
| -------- | ----------------------------------- | ------------------------------- |
| filters  | FilterManagerItem[]                 | Array of filter configurations  |
| value    | FilterManagerValue                  | Current filter values           |
| onChange | (value: FilterManagerValue) => void | Callback when filters change    |
| onSave   | (value: FilterManagerValue) => void | Callback when filters are saved |

## Example Usage

```tsx
import { FilterManager, FilterManagerValue } from '@/plugins/filter-manager/'

const [searchFilters, setSearchFilters] = useState<FilterManagerValue>({})

return (
  <FilterManager
    onChange={value => setSearchFilters(value)}
    value={searchFilters}
    filters={[
      {
        property: 'name',
        type: 'text',
        label: 'Name',
      },
      {
        property: 'status',
        type: 'select',
        label: 'Status',
        options: [
          { label: 'DONE', value: 'DONE' },
          { label: 'TODO', value: 'TODO' },
          { label: 'In Progress', value: 'IN PROGRESS' },
        ],
      },
      {
        property: 'tags',
        type: 'multi-select',
        label: 'Tags',
        options: [
          { label: 'Sale', value: 'sale' },
          { label: 'New', value: 'new' },
          { label: 'Popular', value: 'popular' },
        ],
      },
      {
        property: 'dateRange',
        type: 'range-date',
        label: 'Date Range',
      },
      {
        property: 'priceRange',
        type: 'range-number',
        label: 'Price Range',
        currency: 'USD',
        interval: {
          min: 0,
          max: 1000,
          increment: 10,
        },
      },
    ]}
  />
)
```

## Integration with API Queries

The filter values can be used directly in API queries:

```tsx
const { data } = Api.items.findMany.useQuery({
  where: {
    name: {
      contains: searchFilters?.['name'],
    },
    tags: {
      in: searchFilters?.['tags'],
    },
    status: searchFilters?.['status'],
    price: {
      gte: searchFilters?.['priceRange']?.[0],
      lte: searchFilters?.['priceRange']?.[1],
    },
    createdAt: {
      gte: searchFilters?.['dateRange']?.[0],
      lte: searchFilters?.['dateRange']?.[1],
    },
  },
})
```
