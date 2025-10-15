'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { CheckCircle2, Download, Mail, Home } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Cliente, Contrato } from '@/types'

export default function SucessoPage() {
  const router = useRouter()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [contrato, setContrato] = useState<Contrato | null>(null)

  useEffect(() => {
    // Disparar confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    // Carregar dados
    const clienteData = localStorage.getItem('clienteData')
    const contratoData = localStorage.getItem('contratoData')

    if (clienteData) setCliente(JSON.parse(clienteData))
    if (contratoData) setContrato(JSON.parse(contratoData))

    return () => clearInterval(interval)
  }, [])

  const handleDownload = () => {
    if (contrato?.arquivo_pdf) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      window.open(`${apiUrl}${contrato.arquivo_pdf}`, '_blank')
    }
  }

  const handleVoltar = () => {
    localStorage.clear()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-2 border-green-200 shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Ícone de Sucesso */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Parabéns, {cliente?.nome_completo?.split(' ')[0]}! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8"
            >
              Seu plano foi ativado com sucesso!
            </motion.p>

            {/* Informações do Contrato */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 rounded-2xl p-6 mb-8"
            >
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Número do Contrato</p>
                  <p className="font-bold text-blue-900">{contrato?.numero_contrato}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Plano</p>
                  <p className="font-bold text-blue-900">{contrato?.plano_nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valor</p>
                  <p className="font-bold text-blue-900">{contrato?.plano_valor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="font-bold text-green-600">✓ Assinado</p>
                </div>
              </div>
            </motion.div>

            {/* Informações Adicionais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start gap-3 text-left">
                <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">E-mail Enviado</p>
                  <p className="text-sm text-gray-600">
                    Uma cópia do contrato foi enviada para <strong>{cliente?.email}</strong>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Botões de Ação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar Contrato (PDF)
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={handleVoltar}
              >
                <Home className="w-5 h-5 mr-2" />
                Voltar ao Início
              </Button>
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-gray-500 mt-8"
            >
              Obrigado por escolher nossos serviços! 💙
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

