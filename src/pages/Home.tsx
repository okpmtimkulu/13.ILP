import { Link } from 'react-router-dom'
import { HomeStack } from '../components/HomeStack'
import { getReturnVisitLine } from '../lib/lastVisit'
import { loadProgress, resetProgress } from '../lib/progress'

export function Home() {
  const progress = loadProgress()
  const returnLine = getReturnVisitLine()

  const onResetProgress = () => {
    if (
      !window.confirm(
        'Reset all progress on this device? This clears completed lessons, unlocked devices, map cables, and lab flags. Your theme choice is not changed. To replay a single chapter without wiping everything, use "Restart this lesson" inside that lab.',
      )
    ) {
      return
    }
    resetProgress()
    window.location.reload()
  }

  return (
    <div className="page home">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-eyebrow">Interactive Learning Platform</p>
          <h1 className="hero-title">From a switch to a supercomputer</h1>
          <p className="hero-subtitle">
            Follow one continuous thread from electrical signals to neural networks. Each lesson builds
            on the last — no background needed, just curiosity.
          </p>
          {returnLine ? <p className="home-return-line">{returnLine}</p> : null}

          <div className="hero-actions">
            <Link to="/learn/fundamentals" className="btn primary">
              Start learning
            </Link>
            <Link to="/devices" className="btn ghost">
              Your devices
            </Link>
          </div>
        </div>
      </section>

      <HomeStack progress={progress} />

      <footer className="home-footer">
        <button type="button" className="reset-progress-btn" onClick={onResetProgress}>
          Reset all progress
        </button>
      </footer>
    </div>
  )
}
