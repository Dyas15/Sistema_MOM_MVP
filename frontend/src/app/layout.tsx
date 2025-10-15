import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cadastro e Contratos - Sistema Premium',
  description: 'Sistema profissional de cadastro de clientes e geração de contratos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              background: 'white',
            },
            className: 'my-toast',
          }}
        />
      </body>
    </html>
  )
}

