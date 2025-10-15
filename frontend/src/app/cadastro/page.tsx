'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { User, MapPin, Car, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { apiService } from '@/services/api'
import { formatCPF, formatPhone, formatCEP, validateCPF } from '@/lib/utils'
import type { FormData } from '@/types'

// Schema de validação
const formSchema = z.object({
  nome_completo: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  email: z.string().email('E-mail inválido'),
  celular: z.string().min(15, 'Celular inválido'),
  cep: z.string().min(9, 'CEP inválido'),
  logradouro: z.string().min(3, 'Logradouro inválido'),
  numero: z.string().min(1, 'Número obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro inválido'),
  cidade: z.string().min(2, 'Cidade inválida'),
  estado: z.string().length(2, 'Estado inválido'),
  tem_veiculo: z.boolean().optional(),
  placa: z.string().optional(),
  modelo: z.string().optional(),
  marca: z.string().optional(),
  ano: z.string().optional(),
})

export default function CadastroPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingCEP, setLoadingCEP] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tem_veiculo: false,
    },
  })

  const temVeiculo = watch('tem_veiculo')
  const totalSteps = temVeiculo ? 3 : 2
  const progress = (currentStep / totalSteps) * 100

  const steps = [
    { id: 1, title: 'Dados Pessoais', icon: User },
    { id: 2, title: 'Endereço', icon: MapPin },
    ...(temVeiculo ? [{ id: 3, title: 'Veículo', icon: Car }] : []),
  ]

  // Buscar CEP
  const handleCEPBlur = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length === 8) {
      setLoadingCEP(true)
      try {
        const data = await apiService.consultarCEP(cepLimpo)
        setValue('logradouro', data.logradouro)
        setValue('bairro', data.bairro)
        setValue('cidade', data.cidade)
        setValue('estado', data.estado)
        toast.success('CEP encontrado!')
      } catch (error) {
        toast.error('CEP não encontrado')
      } finally {
        setLoadingCEP(false)
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const clienteData = {
        nome_completo: data.nome_completo,
        cpf: data.cpf,
        email: data.email,
        celular: data.celular,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        ...(data.tem_veiculo && {
          veiculo: {
            placa: data.placa,
            modelo: data.modelo,
            marca: data.marca,
            ano: data.ano,
          },
        }),
      }

      const cliente = await apiService.criarCliente(clienteData)
      
      // Salvar ID do cliente no localStorage
      localStorage.setItem('clienteId', cliente.id.toString())
      localStorage.setItem('clienteData', JSON.stringify(cliente))
      
      toast.success('Cadastro realizado com sucesso!')
      router.push('/revisao')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao realizar cadastro')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete seu Cadastro</h1>
          <p className="text-gray-600">Preencha os dados abaixo para continuar</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="hidden md:block text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Dados Pessoais */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="nome_completo">Nome Completo *</Label>
                    <Input
                      id="nome_completo"
                      placeholder="João da Silva"
                      error={errors.nome_completo?.message}
                      {...register('nome_completo')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      error={errors.cpf?.message}
                      {...register('cpf')}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value)
                        setValue('cpf', formatted)
                      }}
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="celular">Celular *</Label>
                    <Input
                      id="celular"
                      placeholder="(00) 00000-0000"
                      error={errors.celular?.message}
                      {...register('celular')}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value)
                        setValue('celular', formatted)
                      }}
                      maxLength={15}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="tem_veiculo"
                      checked={temVeiculo}
                      onCheckedChange={(checked) => setValue('tem_veiculo', checked as boolean)}
                    />
                    <Label htmlFor="tem_veiculo" className="cursor-pointer">
                      Desejo cadastrar um veículo
                    </Label>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Endereço */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <div className="relative">
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        error={errors.cep?.message}
                        {...register('cep')}
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value)
                          setValue('cep', formatted)
                        }}
                        onBlur={(e) => handleCEPBlur(e.target.value)}
                        maxLength={9}
                      />
                      {loadingCEP && (
                        <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-blue-600" />
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="logradouro">Logradouro *</Label>
                    <Input
                      id="logradouro"
                      placeholder="Rua, Avenida, etc."
                      error={errors.logradouro?.message}
                      {...register('logradouro')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numero">Número *</Label>
                      <Input
                        id="numero"
                        placeholder="123"
                        error={errors.numero?.message}
                        {...register('numero')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        placeholder="Apto, Bloco, etc."
                        {...register('complemento')}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      placeholder="Centro"
                      error={errors.bairro?.message}
                      {...register('bairro')}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        placeholder="São Paulo"
                        error={errors.cidade?.message}
                        {...register('cidade')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="estado">UF *</Label>
                      <Input
                        id="estado"
                        placeholder="SP"
                        error={errors.estado?.message}
                        {...register('estado')}
                        maxLength={2}
                        onChange={(e) => setValue('estado', e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Veículo */}
              {currentStep === 3 && temVeiculo && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="placa">Placa</Label>
                    <Input
                      id="placa"
                      placeholder="ABC-1234"
                      {...register('placa')}
                      onChange={(e) => setValue('placa', e.target.value.toUpperCase())}
                    />
                  </div>

                  <div>
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      placeholder="Civic"
                      {...register('modelo')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      placeholder="Honda"
                      {...register('marca')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ano">Ano</Label>
                    <Input
                      id="ano"
                      placeholder="2023"
                      {...register('ano')}
                      maxLength={4}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" loading={isLoading} disabled={isLoading}>
                  {isLoading ? 'Processando...' : 'Continuar'}
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}