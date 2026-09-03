import type { ProcessingStep } from '../types'

type Props = {
  fileName: string
  previewUrl: string
  label: string
  resultTourTitle: string
  progress: number
  steps: ProcessingStep[]
}

export function ProcessingPanel({
  fileName,
  previewUrl,
  label,
  resultTourTitle,
  progress,
  steps,
}: Props) {
  return (
    <div className="processing-layout">
      <div className="processing-video">
        <video src={previewUrl} muted loop autoPlay playsInline />
        <div className="processing-overlay">
          <span>Converting “{label}”</span>
          <strong>{Math.round(progress * 100)}%</strong>
        </div>
      </div>

      <div className="processing-copy">
        <p className="eyebrow">Step 2 · Convert</p>
        <h2>Turning walkthrough into Gaussian splats</h2>
        <p className="lede">
          Simulating reconstruction for <strong>{label}</strong>. When this
          finishes, the tour opens the mapped stand-in splat{' '}
          <strong>{resultTourTitle}</strong> — not a model trained from this
          clip (no live API key in the PoC).
        </p>
        <p className="file-chip">{fileName}</p>

        <ol className="step-list">
          {steps.map((step) => (
            <li key={step.id} data-status={step.status}>
              <span className="step-dot" />
              {step.label}
            </li>
          ))}
        </ol>

        <div className="progress-track" aria-hidden>
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
