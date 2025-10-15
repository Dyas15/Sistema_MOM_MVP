'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, FileText, User, MapPin, Car, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { apiService } from '@/services/api'
import type { Cliente } from '@/types'

export default function RevisaoPage() {
  const router = useRouter()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [termosAceitos, setTermosAceitos] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const clienteData = localStorage.getItem('clienteData')
    if (!clienteData) {
      toast.error('Dados não encontrados. Refaça o cadastro.')
      router.push('/cadastro')
      return
    }
    setCliente(JSON.parse(clienteData))
  }, [router])

  const handleConfirmar = async () => {
    if (!termosAceitos) {
      toast.error('Você precisa aceitar os termos do contrato')
      return
    }

    if (!cliente) return

    setIsLoading(true)
    try {
      const contrato = await apiService.gerarContrato({
        cliente_id: cliente.id,
        plano_nome: 'Plano Premium',
        plano_valor: 'R$ 99,90/mês',
        termos_aceitos: true,
      })

      localStorage.setItem('contratoId', contrato.id.toString())
      localStorage.setItem('contratoData', JSON.stringify(contrato))

      toast.success('Contrato gerado com sucesso!')
      router.push('/sucesso')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao gerar contrato')
    } finally {
      setIsLoading(false)
    }
  }

  if (!cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Revise seus Dados</h1>
          <p className="text-gray-600">Confira as informações antes de finalizar</p>
        </motion.div>

        {/* Dados Pessoais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-blue-600" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome Completo</p>
                <p className="font-medium">{cliente.nome_completo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="font-medium">{cliente.cpf}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="font-medium">{cliente.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Celular</p>
                <p className="font-medium">{cliente.celular}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Endereço */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">
                {cliente.logradouro}, {cliente.numero}
                {cliente.complemento && ` - ${cliente.complemento}`}
              </p>
              <p className="text-gray-600">
                {cliente.bairro}, {cliente.cidade}/{cliente.estado}
              </p>
              <p className="text-gray-600">CEP: {cliente.cep}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Veículo */}
        {cliente.placa && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Car className="w-5 h-5 text-blue-600" />
                  Veículo
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Placa</p>
                  <p className="font-medium">{cliente.placa}</p>
                </div>
                {cliente.modelo && (
                  <div>
                    <p className="text-sm text-gray-500">Modelo</p>
                    <p className="font-medium">{cliente.modelo}</p>
                  </div>
                )}
                {cliente.marca && (
                  <div>
                    <p className="text-sm text-gray-500">Marca</p>
                    <p className="font-medium">{cliente.marca}</p>
                  </div>
                )}
                {cliente.ano && (
                  <div>
                    <p className="text-sm text-gray-500">Ano</p>
                    <p className="font-medium">{cliente.ano}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Plano */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Plano Contratado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-blue-900">Plano Premium</p>
                  <p className="text-gray-600">Acesso completo a todos os benefícios</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">R$ 99,90</p>
                  <p className="text-sm text-gray-600">por mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Termos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="termos"
                  checked={termosAceitos}
                  onCheckedChange={(checked) => setTermosAceitos(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="termos" className="cursor-pointer text-base">
                    Li e estou de acordo com os{' '}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={(e) => {
                        e.preventDefault()
                        toast.info('Termos do contrato serão exibidos aqui')
                      }}
                    >
                      termos do contrato
                    </a>
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Ao aceitar, você concorda com todas as cláusulas do contrato de adesão
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.push('/cadastro')}
            disabled={isLoading}
          >
            Voltar e Editar
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={handleConfirmar}
            disabled={!termosAceitos || isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Processando...' : 'Confirmar e Assinar'}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

