import { Api } from '@/core/trpc'

type TrackOptions = {
  eventType: string
  distinctId?: string // unique id to reference the user or a project etc.
  sessionId?: string // optional second id to reference a flow from the distinctId
  data?: Record<string, any>
}

export const useMixpanel = () => {
  const { mutateAsync: mixpanelTrack } =
    Api.mixpanel.track.useMutation()
  const { mutateAsync: mixpanelTrackBatch } =
    Api.mixpanel.trackBatch.useMutation()

  const track = async (options: TrackOptions) => {
    if (!mixpanelTrack) {
      console.warn('Mixpanel tracking not initialized')
      return
    }
    await mixpanelTrack(options)
  }

  const trackBatch = async (options: TrackOptions[]) => {
    if (!mixpanelTrackBatch) {
      console.warn('Mixpanel batch tracking not initialized')
      return
    }
    await mixpanelTrackBatch(options)
  }

  return {
    track,
    trackBatch,
  }
}
