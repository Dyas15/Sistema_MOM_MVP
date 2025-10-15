from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nome_completo = Column(String(200), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False, index=True)
    email = Column(String(200), nullable=False)
    celular = Column(String(20), nullable=False)
    
    # Endereço
    cep = Column(String(9), nullable=False)
    logradouro = Column(String(200), nullable=False)
    numero = Column(String(20), nullable=False)
    complemento = Column(String(100), nullable=True)
    bairro = Column(String(100), nullable=False)
    cidade = Column(String(100), nullable=False)
    estado = Column(String(2), nullable=False)
    
    # Dados do veículo (opcional)
    placa = Column(String(8), nullable=True)
    modelo = Column(String(100), nullable=True)
    marca = Column(String(100), nullable=True)
    ano = Column(String(4), nullable=True)
    
    # Timestamps
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    atualizado_em = Column(DateTime(timezone=True), onupdate=func.now())

class Contrato(Base):
    __tablename__ = "contratos"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, nullable=False, index=True)
    numero_contrato = Column(String(50), unique=True, nullable=False, index=True)
    
    # Status do contrato
    status = Column(String(20), default="pendente")  # pendente, assinado, cancelado
    
    # Arquivo PDF
    arquivo_pdf = Column(String(500), nullable=True)
    
    # Dados do plano
    plano_nome = Column(String(100), nullable=False)
    plano_valor = Column(String(20), nullable=False)
    
    # Termos aceitos
    termos_aceitos = Column(Boolean, default=False)
    data_aceite = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    assinado_em = Column(DateTime(timezone=True), nullable=True)

