import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { recordVisit } from '../lib/lastVisit'
import { getContinuePath } from '../content/journeyStack'
import { loadProgress } from '../lib/progress'
import { ClarityPanel } from './ClarityPanel'
import { LearnSidebar } from './LearnSidebar'
import { StackDepthIndicator } from './StackDepthIndicator'
import { ThemeToggle } from './ThemeToggle'
import { SpeedReader } from './SpeedReader'

function isLearnWorkspace(pathname: string) {
  return pathname.startsWith('/learn/') || pathname === '/devices'
}

export function Layout() {
  const loc = useLocation()
  const workspace = isLearnWorkspace(loc.pathname)
  const isLearnActive = loc.pathname.startsWith('/learn/')
  const progress = loadProgress()
  const learnHref = getContinuePath(progress)

  useEffect(() => {
    recordVisit(loc.pathname)
  }, [loc.pathname])

  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden />
          ILP Lab
        </Link>

        <nav className="nav-links" aria-label="Main">
          <Link to="/" className={loc.pathname === '/' ? 'active' : undefined}>
            Home
          </Link>
          <Link to={learnHref} className={isLearnActive ? 'active' : undefined}>
            Learn
          </Link>
          <Link to="/devices" className={loc.pathname === '/devices' ? 'active' : undefined}>
            Devices
          </Link>
        </nav>

        <ThemeToggle />
      </header>

      {workspace ? (
        <>
          <div className="learn-workspace">
            <LearnSidebar />
            <main className="learn-main">
              <StackDepthIndicator />
              <Outlet />
            </main>
          </div>
          <ClarityPanel />
        </>
      ) : (
        <main className="main-stage">
          <Outlet />
        </main>
      )}
      <SpeedReader key={loc.pathname} />
    </div>
  )
}
