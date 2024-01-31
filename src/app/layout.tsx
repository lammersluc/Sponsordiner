import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sponsordiner',
  description: 'Maud Lammers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        <Toaster containerStyle={{textAlign:'center'}}/>
      </body>
    </html>
  )
}
