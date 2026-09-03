import type { SampleTour, SampleVideo } from '../types'

export const SAMPLE_TOURS: SampleTour[] = [
  {
    id: 'kitchen',
    title: 'Kitchen interior',
    description:
      'Mip-NeRF 360 kitchen reconstructed as 3D Gaussian splats.',
    splatUrl: '/samples/splats/kitchen.splat',
    coverHint: 'Drag to look · scroll to zoom · WASD to walk',
  },
  {
    id: 'bonsai',
    title: 'Indoor bonsai room',
    description:
      'Mip-NeRF 360 bonsai scene reconstructed as 3D Gaussian splats.',
    splatUrl: '/samples/splats/bonsai.splat',
    coverHint: 'Drag to look · scroll to zoom · WASD to walk',
  },
]

export const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    id: 'apartment',
    title: 'Apartment viewing',
    description:
      'Couple touring a residential apartment — stands in for an iPhone walkthrough.',
    src: '/samples/videos/apartment-viewing.mp4',
    credit: 'Mixkit — Viewing a new apartment',
    resultTourId: 'kitchen',
  },
  {
    id: 'house',
    title: 'House move-in',
    description: 'Family entering a home interior — second sample property clip.',
    src: '/samples/videos/house-moving.mp4',
    credit: 'Mixkit — Moving into a new house',
    resultTourId: 'bonsai',
  },
]

export const TOUR_BY_ID = Object.fromEntries(
  SAMPLE_TOURS.map((tour) => [tour.id, tour]),
) as Record<string, SampleTour>

export const DEFAULT_UPLOAD_TOUR = SAMPLE_TOURS[0]

export function resolveTour(tourId: string): SampleTour {
  return TOUR_BY_ID[tourId] ?? DEFAULT_UPLOAD_TOUR
}
