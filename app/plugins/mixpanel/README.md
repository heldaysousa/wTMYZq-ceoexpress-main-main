## Mixpanel Plugin

Mixpanel allows you to seamlessly track, analyze, and visualize user interactions and events within your app

## Client

### Track events

Use the `useMixpanel` hook in the frontend to track events:

```tsx
const { track, trackBatch } = useMixpanel()

track({
  eventType: 'event-name',
  distinctId: user.id, // optional
  sessionId: project.id, // optional
  data: { page: 'home' }, // optional
})
```

## Server

### Usage

Use the `MixpanelServer` in the backend to track events in custom Router:

```tsx
import { MixpanelServer } from '~/plugins/mixpanel/server'

export const UploadRouter = Trpc.createRouter({
  fromPrivateToPublicUrl: Trpc.procedure
    .input(
      z.object({
        url: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await UploadService.fromPrivateToPublicUrl({
        url: input.url,
      })

      const url = response[0].url

      await MixpanelServer.service.track({
        eventType: 'file-upload',
        data: { url },
      })

      return { url }
    }),
})
```

### Setup

- Set `MixpanelServer.trpcRouter` in your appRouter:

```tsx
mixpanel: MixpanelServer.trpcRouter
```

- Define `MIXPANEL_PROJECT_TOKEN` in your .env

## Nextjs specificity

1. Install the plugin at `src/server/libraries`
2. cut/paste `src/server/libraries/mixpanel/client` content to `src/core/hooks/mixpanel/client`
3. solve import error in by replacing `import { Trpc } from '@/core/trpc/base'` by `import { Trpc } from '@/core/trpc/server'` in `mixpanel/server/index.tsx`

(import in example can be different for a nextjs app)
