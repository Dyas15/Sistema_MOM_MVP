from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.routers import cadastro
import os

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Cadastro e Contratos",
    description="API para cadastro de clientes e geração de contratos",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar diretório de contratos se não existir
os.makedirs("contracts", exist_ok=True)

# Servir arquivos estáticos (PDFs)
app.mount("/contracts", StaticFiles(directory="contracts"), name="contracts")

# Incluir routers
app.include_router(cadastro.router, prefix="/api", tags=["cadastro"])

@app.get("/")
async def root():
    return {
        "message": "API Sistema de Cadastro e Contratos",
        "version": "1.0.0",
        "status": "online"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

