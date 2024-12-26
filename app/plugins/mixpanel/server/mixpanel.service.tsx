import { Utility } from '@/core/helpers/utility'
import { Event, Mixpanel, init } from 'mixpanel'

type TrackOptions = {
  eventType: string
  distinctId?: string // unique id to reference the user or a project etc.
  sessionId?: string // optional second id to reference a flow from the distinctId
  data?: Record<string, any>
}

class Service {
  private mixpanelInstance: Mixpanel | null = null

  constructor() {
    this.initialise()
  }

  async initialise() {
    try {
      const token = process.env.MIXPANEL_PROJECT_TOKEN

      if (Utility.isNull(token)) {
        console.warn(`Set MIXPANEL_PROJECT_TOKEN to activate Mixpanel`)
        return
      }

      this.mixpanelInstance = init(token)

      console.log(`Mixpanel service active`)
    } catch (error) {
      console.error(`Could not start Mixpanel service: ${error.message}`)
    }
  }

  async track(options: TrackOptions) {
    if (!this.mixpanelInstance) {
      return
    }

    this.mixpanelInstance.track(options.eventType, {
      ...options.data,
      session_id: options.sessionId,
      distinct_id: options.distinctId,
    })
  }

  async trackBatch(options: TrackOptions[]) {
    if (!this.mixpanelInstance) {
      return
    }

    const events: Event[] = options.map(option => ({
      event: option.eventType,
      properties: {
        ...option.data,
        session_id: option.sessionId,
        distinct_id: option.distinctId,
      },
    }))

    this.mixpanelInstance.track_batch(events)
  }
}

class Singleton {
  static service = new Service()
}

export const MixPanelService = Singleton.service
