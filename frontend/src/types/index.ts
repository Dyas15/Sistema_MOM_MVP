export interface FormData {
  // Dados Pessoais
  nome_completo: string
  cpf: string
  email: string
  celular: string
  
  // Endereço
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  
  // Veículo (opcional)
  tem_veiculo?: boolean
  placa?: string
  modelo?: string
  marca?: string
  ano?: string
}

export interface Cliente {
  id: number
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
  placa?: string
  modelo?: string
  marca?: string
  ano?: string
  criado_em: string
}

export interface Contrato {
  id: number
  cliente_id: number
  numero_contrato: string
  status: string
  arquivo_pdf?: string
  plano_nome: string
  plano_valor: string
  criado_em: string
  assinado_em?: string
}

