import { useRef, useState, type DragEvent, type ChangeEvent } from 'react'
import { DEFAULT_UPLOAD_TOUR, SAMPLE_TOURS, SAMPLE_VIDEOS } from '../data/samples'
import type { SampleVideo, VideoJob } from '../types'

type Props = {
  onStartJob: (job: VideoJob) => void
  onOpenDemoTour: (tourId: string) => void
}

export function UploadPanel({ onStartJob, onOpenDemoTour }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<SampleVideo | null>(SAMPLE_VIDEOS[0])
  const [busyId, setBusyId] = useState<string | null>(null)

  const acceptFile = (file: File) => {
    if (!file.type.startsWith('video/')) return
    const url = URL.createObjectURL(file)
    onStartJob({
      fileName: file.name,
      previewUrl: url,
      label: file.name,
      resultTourId: DEFAULT_UPLOAD_TOUR.id,
    })
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) acceptFile(file)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) acceptFile(file)
  }

  const useSample = async (sample: SampleVideo) => {
    setBusyId(sample.id)
    try {
      const res = await fetch(sample.src)
      const blob = await res.blob()
      const file = new File([blob], `${sample.id}-walkthrough.mp4`, {
        type: blob.type || 'video/mp4',
      })
      onStartJob({
        fileName: file.name,
        previewUrl: sample.src,
        label: sample.title,
        resultTourId: sample.resultTourId,
      })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="upload-layout">
      <section className="drop-zone-block">
        <button
          type="button"
          className={`drop-zone ${dragging ? 'is-dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <span className="drop-kicker">Step 1 · Capture</span>
          <strong>Drop an iPhone walkthrough video</strong>
          <span className="drop-hint">
            MP4 / MOV from a slow walk through each room. Or pick a sample below
            to run the Convert → Tour flow.
          </span>
          <span className="drop-cta">Choose video</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={onChange}
        />
      </section>

      <section className="samples-block">
        <div className="section-head">
          <h2>Sample walkthroughs</h2>
          <p>
            Each clip runs Convert, then opens a different stand-in splat (this
            PoC does not train a model from the video yet).
          </p>
        </div>

        <div className="sample-grid">
          {SAMPLE_VIDEOS.map((sample) => (
            <article
              key={sample.id}
              className={`sample-card ${preview?.id === sample.id ? 'is-active' : ''}`}
            >
              <button
                type="button"
                className="sample-thumb"
                onClick={() => setPreview(sample)}
              >
                <video
                  src={sample.src}
                  muted
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => void e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause()
                    e.currentTarget.currentTime = 0
                  }}
                />
              </button>
              <div className="sample-meta">
                <h3>{sample.title}</h3>
                <p>{sample.description}</p>
                <span className="credit">{sample.credit}</span>
                <span className="credit">
                  Convert result →{' '}
                  {SAMPLE_TOURS.find((t) => t.id === sample.resultTourId)?.title}
                </span>
                <button
                  type="button"
                  className="text-btn"
                  disabled={busyId === sample.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    void useSample(sample)
                  }}
                >
                  {busyId === sample.id ? 'Starting convert…' : 'Use this clip'}
                </button>
              </div>
            </article>
          ))}
        </div>

        {preview && (
          <div className="preview-player">
            <video key={preview.id} src={preview.src} controls playsInline />
          </div>
        )}

        <div className="demo-tour-cta">
          <div>
            <h2>Skip convert</h2>
            <p>
              Jump straight into a pre-built splat without running the mock
              pipeline.
            </p>
          </div>
          <div className="demo-tour-actions">
            {SAMPLE_TOURS.map((tour) => (
              <button
                key={tour.id}
                type="button"
                className="primary-btn"
                onClick={() => onOpenDemoTour(tour.id)}
              >
                Open {tour.title}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
