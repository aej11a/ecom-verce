import './globals.css'

export const metadata = {
  title: 'Glass & Co.',
  description: 'Your one-stop glassware shop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

