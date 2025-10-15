import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ClienteData {
  nome_completo: string
  cpf: string
  email: string
  celular: string
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  veiculo?: {
    placa?: string
    modelo?: string
    marca?: string
    ano?: string
  }
}

export interface ContratoData {
  cliente_id: number
  plano_nome: string
  plano_valor: string
  termos_aceitos: boolean
}

export interface CEPData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

// Endpoints
export const apiService = {
  // Consultar CEP
  consultarCEP: async (cep: string): Promise<CEPData> => {
    const response = await api.get(`/api/cep/${cep}`)
    return response.data
  },

  // Criar cliente
  criarCliente: async (data: ClienteData) => {
    const response = await api.post('/api/clientes', data)
    return response.data
  },

  // Obter cliente
  obterCliente: async (id: number) => {
    const response = await api.get(`/api/clientes/${id}`)
    return response.data
  },

  // Gerar contrato
  gerarContrato: async (data: ContratoData) => {
    const response = await api.post('/api/contratos/gerar', data)
    return response.data
  },

  // Obter contrato
  obterContrato: async (id: number) => {
    const response = await api.get(`/api/contratos/${id}`)
    return response.data
  },
}

export default api