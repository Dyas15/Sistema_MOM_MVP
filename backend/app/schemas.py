from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
import re

class DadosVeiculo(BaseModel):
    placa: Optional[str] = None
    modelo: Optional[str] = None
    marca: Optional[str] = None
    ano: Optional[str] = None

class ClienteCreate(BaseModel):
    # Dados pessoais
    nome_completo: str = Field(..., min_length=3, max_length=200)
    cpf: str = Field(..., pattern=r'^\d{3}\.\d{3}\.\d{3}-\d{2}$')
    email: EmailStr
    celular: str = Field(..., pattern=r'^\(\d{2}\) \d{5}-\d{4}$')
    
    # Endereço
    cep: str = Field(..., pattern=r'^\d{5}-\d{3}$')
    logradouro: str = Field(..., min_length=3, max_length=200)
    numero: str = Field(..., min_length=1, max_length=20)
    complemento: Optional[str] = Field(None, max_length=100)
    bairro: str = Field(..., min_length=2, max_length=100)
    cidade: str = Field(..., min_length=2, max_length=100)
    estado: str = Field(..., pattern=r'^[A-Z]{2}$')
    
    # Dados do veículo (opcional)
    veiculo: Optional[DadosVeiculo] = None
    
    @validator('cpf')
    def validate_cpf(cls, v):
        cpf = re.sub(r'\D', '', v)
        
        if len(cpf) != 11 or cpf == cpf[0] * 11:
            raise ValueError('CPF inválido')
        
        # Validar dígitos verificadores
        def calc_digit(cpf_partial):
            sum_val = sum((len(cpf_partial) + 1 - i) * int(d) for i, d in enumerate(cpf_partial))
            remainder = sum_val % 11
            return 0 if remainder < 2 else 11 - remainder
        
        if calc_digit(cpf[:9]) != int(cpf[9]) or calc_digit(cpf[:10]) != int(cpf[10]):
            raise ValueError('CPF inválido')
        
        return v

class ClienteResponse(BaseModel):
    id: int
    nome_completo: str
    cpf: str
    email: str
    celular: str
    cep: str
    logradouro: str
    numero: str
    complemento: Optional[str]
    bairro: str
    cidade: str
    estado: str
    placa: Optional[str]
    modelo: Optional[str]
    marca: Optional[str]
    ano: Optional[str]
    criado_em: datetime

    class Config:
        from_attributes = True

class ContratoCreate(BaseModel):
    cliente_id: int
    plano_nome: str = "Plano Premium"
    plano_valor: str = "R$ 99,90/mês"
    termos_aceitos: bool = True

class ContratoResponse(BaseModel):
    id: int
    cliente_id: int
    numero_contrato: str
    status: str
    arquivo_pdf: Optional[str]
    plano_nome: str
    plano_valor: str
    criado_em: datetime
    assinado_em: Optional[datetime]

    class Config:
        from_attributes = True

class CEPResponse(BaseModel):
    cep: str
    logradouro: str
    complemento: str
    bairro: str
    localidade: str
    uf: str
    erro: Optional[bool] = None

