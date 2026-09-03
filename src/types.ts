export type AppStage = 'upload' | 'processing' | 'tour'

export type ProcessingStep = {
  id: string
  label: string
  status: 'pending' | 'active' | 'done'
}

export type SampleVideo = {
  id: string
  title: string
  description: string
  src: string
  credit: string
  /** Pre-built splat used as the mock conversion output for this clip. */
  resultTourId: string
}

export type SampleTour = {
  id: string
  title: string
  description: string
  splatUrl: string
  coverHint: string
}

export type TourMeta = {
  title: string
  description: string
  splatUrl: string
  sourceLabel?: string
}

export type VideoJob = {
  fileName: string
  previewUrl: string
  label: string
  resultTourId: string
}
