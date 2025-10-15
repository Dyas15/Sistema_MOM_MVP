'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Shield, Zap, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const benefits = [
    {
      icon: Zap,
      title: 'Rápido e Simples',
      description: 'Cadastro em menos de 3 minutos'
    },
    {
      icon: Shield,
      title: '100% Seguro',
      description: 'Seus dados protegidos com criptografia'
    },
    {
      icon: CheckCircle2,
      title: 'Sem Burocracia',
      description: 'Processo totalmente digital'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            Plano Premium
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
          >
            Bem-vindo ao seu
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Plano Premium - MVP
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Complete seu cadastro em poucos passos e comece a aproveitar todos os benefícios.
          </motion.p>

          {/* Benefícios */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mb-10"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: 'spring' }}
          >
            <Button
              size="xl"
              className="w-full group shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => router.push('/cadastro')}
            >
              Iniciar Cadastro
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-sm text-gray-500 mt-6"
          >
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-blue-600 hover:underline">
              termos de serviço
            </a>
          </motion.p>
        </div>

        {/* Decoração */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Seus dados estão seguros conosco
        </motion.div>
      </motion.div>
    </div>
  )
}

