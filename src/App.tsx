import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_UPLOAD_TOUR, resolveTour, SAMPLE_TOURS } from './data/samples'
import { UploadPanel } from './components/UploadPanel'
import { ProcessingPanel } from './components/ProcessingPanel'
import { TourPanel } from './components/TourPanel'
import type { AppStage, ProcessingStep, TourMeta, VideoJob } from './types'
import './App.css'

const STEP_DEFS = [
  { id: 'frames', label: 'Extracting frames from walkthrough' },
  { id: 'pose', label: 'Estimating camera poses' },
  { id: 'train', label: 'Training Gaussian splat model' },
  { id: 'pack', label: 'Packaging web-ready .splat' },
] as const

function App() {
  const [stage, setStage] = useState<AppStage>('upload')
  const [job, setJob] = useState<VideoJob | null>(null)
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [tourMeta, setTourMeta] = useState<TourMeta>({
    title: DEFAULT_UPLOAD_TOUR.title,
    description: DEFAULT_UPLOAD_TOUR.description,
    splatUrl: DEFAULT_UPLOAD_TOUR.splatUrl,
    sourceLabel: 'Demo splat',
  })

  const steps: ProcessingStep[] = useMemo(
    () =>
      STEP_DEFS.map((step, index) => ({
        ...step,
        status:
          index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'pending',
      })),
    [stepIndex],
  )

  useEffect(() => {
    if (stage !== 'processing' || !job) return

    setProgress(0)
    setStepIndex(0)

    const started = performance.now()
    const durationMs = 5200
    let raf = 0
    const activeJob = job

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / durationMs)
      setProgress(t)
      setStepIndex(Math.min(STEP_DEFS.length - 1, Math.floor(t * STEP_DEFS.length)))

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setStepIndex(STEP_DEFS.length)
        const tour = resolveTour(activeJob.resultTourId)
        setTourMeta({
          title: `${activeJob.label} → ${tour.title}`,
          description: `Mock conversion of “${activeJob.label}” finished. Loaded stand-in splat “${tour.title}” (no live reconstruction API in this PoC).`,
          splatUrl: tour.splatUrl,
          sourceLabel: activeJob.fileName,
        })
        setStage('tour')
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stage, job])

  const startJob = (next: VideoJob) => {
    setJob(next)
    setStage('processing')
  }

  const openDemoTour = (tourId: string) => {
    const tour = resolveTour(tourId)
    setTourMeta({
      title: tour.title,
      description: `${tour.description} Opened directly — conversion was skipped.`,
      splatUrl: tour.splatUrl,
      sourceLabel: 'Pre-built sample',
    })
    setStage('tour')
  }

  const reset = () => {
    setStage('upload')
    setJob(null)
    setProgress(0)
    setStepIndex(0)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <p className="brand-name">RoomWalk</p>
            <p className="brand-tag">Video → Gaussian splat virtual tour</p>
          </div>
        </div>
        <nav className="stage-nav" aria-label="Workflow stages">
          <span data-active={stage === 'upload'}>Upload</span>
          <span data-active={stage === 'processing'}>Convert</span>
          <span data-active={stage === 'tour'}>Tour</span>
        </nav>
      </header>

      <main>
        {stage === 'upload' && (
          <>
            <section className="hero-copy">
              <h1>Walk the property. Ship a 3D tour.</h1>
              <p>
                Proof of concept for converting an iPhone walkthrough into an
                interactive Gaussian-splat tour in the browser — using existing
                reconstruction tools, not a custom AI model.
              </p>
            </section>
            <UploadPanel onStartJob={startJob} onOpenDemoTour={openDemoTour} />
          </>
        )}

        {stage === 'processing' && job && (
          <ProcessingPanel
            fileName={job.fileName}
            previewUrl={job.previewUrl}
            label={job.label}
            resultTourTitle={resolveTour(job.resultTourId).title}
            progress={progress}
            steps={steps}
          />
        )}

        {stage === 'tour' && (
          <TourPanel
            title={tourMeta.title}
            description={tourMeta.description}
            splatUrl={tourMeta.splatUrl}
            sourceLabel={tourMeta.sourceLabel}
            onBack={reset}
          />
        )}
      </main>

      <footer className="site-footer">
        <p>
          PoC for the 3D Virtual Tours brief. Sample videos: Mixkit. Splats:{' '}
          {SAMPLE_TOURS.map((t) => t.title).join(', ')} from dylanebert/3dgs
          (Mip-NeRF 360). Viewer:{' '}
          <a href="https://sparkjs.dev" target="_blank" rel="noreferrer">
            Spark.js
          </a>
          .
        </p>
      </footer>
    </div>
  )
}

export default App
