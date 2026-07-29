'use client'

import dynamic from 'next/dynamic'

const SitesApp = dynamic(() => import('../../src/SitesApp'), {
  ssr: false,
})

export default function Page() {
  return <SitesApp />
}
