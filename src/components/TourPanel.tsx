import { useCallback, useState } from 'react'
import { SplatViewer } from './SplatViewer'

type Props = {
  title: string
  description: string
  splatUrl: string
  sourceLabel?: string
  onBack: () => void
}

export function TourPanel({
  title,
  description,
  splatUrl,
  sourceLabel,
  onBack,
}: Props) {
  const [loadRatio, setLoadRatio] = useState(0)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onReady = useCallback(() => setReady(true), [])
  const onProgress = useCallback((ratio: number) => setLoadRatio(ratio), [])
  const onError = useCallback((message: string) => setError(message), [])

  return (
    <div className="tour-layout">
      <header className="tour-bar">
        <button type="button" className="ghost-btn" onClick={onBack}>
          ← New capture
        </button>
        <div className="tour-titles">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {sourceLabel && <span className="pill">{sourceLabel}</span>}
      </header>

      <div className="tour-stage">
        <SplatViewer
          splatUrl={splatUrl}
          onReady={onReady}
          onProgress={onProgress}
          onError={onError}
        />

        {!ready && !error && (
          <div className="tour-loading">
            <div className="spinner" />
            <p>Loading Gaussian splat… {Math.round(loadRatio * 100)}%</p>
            <span>Kitchen sample is ~54&nbsp;MB on first load.</span>
          </div>
        )}

        {error && (
          <div className="tour-loading">
            <p>Could not load tour: {error}</p>
          </div>
        )}

        {ready && (
          <aside className="tour-help">
            <strong>Navigate</strong>
            <ul>
              <li>Drag — look around</li>
              <li>Scroll — zoom</li>
              <li>WASD — walk</li>
              <li>Q / E — down / up</li>
              <li>Shift — faster</li>
            </ul>
          </aside>
        )}
      </div>
    </div>
  )
}
