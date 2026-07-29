import type { ReactNode } from 'react'
import '../src/index.css'

const themeScript = `
  (function () {
    try {
      var theme = localStorage.getItem('ilp-theme');
      if (theme === 'light' || theme === 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
        return;
      }
    } catch (error) {}
    try {
      var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', preferred);
    } catch (error) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`

export const metadata = {
  title: 'OKP Lab — interactive computer science',
  description: 'Learn computer science from electrical signals to neural networks through interactive lessons.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
