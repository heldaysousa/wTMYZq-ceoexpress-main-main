# Admin Dashboard Plugin

The Admin Dashboatd allow you to visualise, create, edit and delete data as an Admin.

## Client

The AdminDashboardClient module exports the useAdminDashboard hook and the AdminDashboard component for displaying and managing any models data.

## Example

```tsx
import { Typography } from 'antd'
import { PageLayout } from '~/designSystem'
import { AdminDashboardClient } from '~/plugins/admin-dashboard/client'

export default function AdminPage() {
  const hook = AdminDashboardClient.useAdminDashboard({
    countItemsByPages: 10,
  })

  return (
    <PageLayout>
      <Typography.Title level={1}>Admin Dashboard</Typography.Title>

      <AdminDashboardClient.AdminDashboard hook={hook}>
        {/* Add any additional elements as children here for example: */}
        {/* {user => <Card style={{ height: '50vh' }}>{user.email}</Card>} */}
      </AdminDashboardClient.AdminDashboard>
    </PageLayout>
  )
}
```

## Visual

### Visual your data

![Admin Dashoard Screenshot](https://i.imgur.com/eIOr76i.png)

### Edit your data

![Admin Dashoard Edit Screenshot](https://i.imgur.com/U66cVeQ.png)
