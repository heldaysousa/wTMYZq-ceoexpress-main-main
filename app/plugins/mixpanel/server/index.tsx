import { Trpc } from '@/core/trpc/server'
import { z } from 'zod'
import { MixPanelService } from './mixpanel.service'

const trackSchema = z.object({
  eventType: z.string(),
  distinctId: z.string().optional(),
  sessionId: z.string().optional(),
  data: z.record(z.string(), z.any()).optional(),
})

const trackBatchSchema = z.array(trackSchema)

const trpcRouter = Trpc.createRouter({
  initialise: Trpc.procedurePublic.input(z.object({})).mutation(async () => {
    try {
      await MixPanelService.initialise()
    } catch (error) {
      console.warn(`Error initialising Mixpanel: ${error.message}`)
    }
  }),
  track: Trpc.procedurePublic
    .input(
      z.object({
        eventType: z.string(),
        distinctId: z.string().optional(),
        sessionId: z.string().optional(),
        data: z.record(z.string(), z.any()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { eventType, distinctId, sessionId, data } = input

        MixPanelService.track({ eventType, distinctId, sessionId, data })
      } catch (error) {
        console.warn(`Error tracking event: ${error.message}`)
      }
    }),
  trackBatch: Trpc.procedurePublic
    .input(trackBatchSchema)
    .mutation(async ({ input }) => {
      try {
        const options = input.map(
          ({ eventType, distinctId, sessionId, data }) => ({
            eventType,
            distinctId,
            sessionId,
            data,
          }),
        )

        MixPanelService.trackBatch(options)
      } catch (error) {
        console.warn(`Error tracking batch: ${error.message}`)
      }
    }),
})

export const MixpanelServer = {
  trpcRouter,
  service: MixPanelService,
}
