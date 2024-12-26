# Custom Dashboard

A component that enables users to create and manage customizable dashboards with various chart types.

## Features

- Drag and drop chart reordering
- Multiple chart types (pie, line, bar, number)
- Customizable filters
- Data grouping
- Expandable charts
- Edit/Delete functionality

## Installation

You will have to store the custom dashboard on one entity in your data model as a JSON. For example on a user, or an organization, or an project.

```prisma
model User {
  ...

  customDashboard Json?
  ...
}
```

## Usage

```tsx
import { DashboardGrid } from '@/plugins/custom-dashboard'
import { useUserContext } from '~/core/context'
import { Api } from '~/core/trpc'

export default function MyDashboard() {
  const { user, refetch } = useUserContext()
  const { mutateAsync: updateUser } = Api.user.update.useMutation()

  const { data: taskDataSet } = Api.task.findMany.useQuery()

  return (
    <DashboardGrid
      chartConfigs={[
        {
          dataSet: 'Tasks',
          data: taskDataSet?.map(item => ({
            ...item,
            value: 1,
          })),
          groupBy: [
            {
              label: 'Status',
              value: 'status',
            },
            {
              label: 'Assignee',
              value: 'assigneeId',
            },
          ],
          filters: [
            {
              property: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { label: 'Todo', value: 'TODO' },
                { label: 'Done', value: 'DONE' },
              ],
            },
          ],
        },
      ]}
      value={user?.customDashboard}
      onChange={async values => {
        await updateUser({
          where: { id: user?.id },
          data: {
            customDashboard: values,
          },
        })
        refetch()
      }}
    />
  )
}
```

## Props

### DashboardGrid

| Prop         | Type                                | Required | Description                                     |
| ------------ | ----------------------------------- | -------- | ----------------------------------------------- |
| chartConfigs | ChartConfig[]                       | Yes      | Array of available chart configurations         |
| value        | ChartConfigValue[]                  | Yes      | Array of saved chart configurations             |
| onChange     | (value: ChartConfigValue[]) => void | No       | Callback when charts are modified               |
| isEditable   | boolean                             | No       | Whether dashboard can be edited (default: true) |

### ChartConfig

| Property | Type                             | Required | Description                    |
| -------- | -------------------------------- | -------- | ------------------------------ |
| dataSet  | string                           | Yes      | Identifier for the data source |
| data     | any[]                            | Yes      | Array of data objects          |
| groupBy  | {label: string, value: string}[] | No       | Available grouping options     |
| filters  | FilterManagerItem[]              | No       | Available filters              |

### ChartConfigValue

| Property     | Type                                 | Required | Description              |
| ------------ | ------------------------------------ | -------- | ------------------------ |
| id           | string                               | Yes      | Unique identifier        |
| dataSet      | string                               | Yes      | Selected data source     |
| title        | string                               | Yes      | Chart title              |
| type         | 'pie' \| 'line' \| 'bar' \| 'number' | Yes      | Chart visualization type |
| groupBy      | string                               | No       | Selected grouping field  |
| filtersValue | FilterManagerValue[]                 | No       | Applied filter values    |
