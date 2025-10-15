from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import httpx
from datetime import datetime

from app.database import get_db
from app.models import Cliente, Contrato
from app.schemas import (
    ClienteCreate, 
    ClienteResponse, 
    ContratoCreate, 
    ContratoResponse,
    CEPResponse
)
from app.services.signature_simulator import SignatureSimulatorService
from app.services.pdf_generator import PDFGenerator

router = APIRouter()

# Serviços
signature_service = SignatureSimulatorService()
pdf_generator = PDFGenerator()

@router.post("/clientes", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
async def criar_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    """
    Criar novo cliente no sistema
    """
    # Verificar se CPF já existe
    existing = db.query(Cliente).filter(Cliente.cpf == cliente.cpf).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CPF já cadastrado no sistema"
        )
    
    # Criar cliente
    db_cliente = Cliente(
        nome_completo=cliente.nome_completo,
        cpf=cliente.cpf,
        email=cliente.email,
        celular=cliente.celular,
        cep=cliente.cep,
        logradouro=cliente.logradouro,
        numero=cliente.numero,
        complemento=cliente.complemento,
        bairro=cliente.bairro,
        cidade=cliente.cidade,
        estado=cliente.estado,
        placa=cliente.veiculo.placa if cliente.veiculo else None,
        modelo=cliente.veiculo.modelo if cliente.veiculo else None,
        marca=cliente.veiculo.marca if cliente.veiculo else None,
        ano=cliente.veiculo.ano if cliente.veiculo else None,
    )
    
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    
    return db_cliente

@router.get("/clientes/{cliente_id}", response_model=ClienteResponse)
async def obter_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """
    Obter dados de um cliente específico
    """
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado"
        )
    return cliente

@router.post("/contratos/gerar", response_model=ContratoResponse)
async def gerar_contrato(contrato_data: ContratoCreate, db: Session = Depends(get_db)):
    """
    Gerar contrato e simular assinatura
    """
    # Buscar cliente
    cliente = db.query(Cliente).filter(Cliente.id == contrato_data.cliente_id).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado"
        )
    
    # Verificar se já existe contrato para este cliente
    existing_contrato = db.query(Contrato).filter(
        Contrato.cliente_id == contrato_data.cliente_id,
        Contrato.status == "assinado"
    ).first()
    
    if existing_contrato:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cliente já possui contrato assinado"
        )
    
    # Gerar número do contrato
    numero_contrato = f"CTR-{datetime.now().strftime('%Y%m%d')}-{cliente.id:04d}"
    
    # Criar contrato no banco
    db_contrato = Contrato(
        cliente_id=cliente.id,
        numero_contrato=numero_contrato,
        plano_nome=contrato_data.plano_nome,
        plano_valor=contrato_data.plano_valor,
        termos_aceitos=contrato_data.termos_aceitos,
        data_aceite=datetime.now() if contrato_data.termos_aceitos else None,
        status="pendente"
    )
    
    db.add(db_contrato)
    db.commit()
    db.refresh(db_contrato)
    
    # Gerar PDF do contrato
    pdf_path = pdf_generator.gerar_contrato(cliente, db_contrato)
    
    # Simular assinatura
    resultado = signature_service.sign_document(cliente, db_contrato, pdf_path)
    
    # Atualizar contrato com status de assinado
    db_contrato.status = "assinado"
    db_contrato.assinado_em = datetime.now()
    db_contrato.arquivo_pdf = resultado["contract_url"]
    
    db.commit()
    db.refresh(db_contrato)
    
    return db_contrato

@router.get("/contratos/{contrato_id}", response_model=ContratoResponse)
async def obter_contrato(contrato_id: int, db: Session = Depends(get_db)):
    """
    Obter dados de um contrato específico
    """
    contrato = db.query(Contrato).filter(Contrato.id == contrato_id).first()
    if not contrato:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contrato não encontrado"
        )
    return contrato

@router.get("/cep/{cep}")
async def consultar_cep(cep: str):
    """
    Consultar CEP usando API ViaCEP
    """
    # Remover formatação
    cep_limpo = cep.replace("-", "").replace(".", "")
    
    if len(cep_limpo) != 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CEP inválido"
        )
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"https://viacep.com.br/ws/{cep_limpo}/json/")
            response.raise_for_status()
            data = response.json()
            
            if data.get("erro"):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="CEP não encontrado"
                )
            
            return {
                "cep": data.get("cep"),
                "logradouro": data.get("logradouro"),
                "complemento": data.get("complemento"),
                "bairro": data.get("bairro"),
                "cidade": data.get("localidade"),
                "estado": data.get("uf")
            }
        except httpx.HTTPError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Erro ao consultar CEP"
            )

