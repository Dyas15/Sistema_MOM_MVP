from typing import Dict, Any
import logging
from datetime import datetime
from app.services.signature_interface import SignatureService
from app.services.email_service import EmailService

logger = logging.getLogger(__name__)

class SignatureSimulatorService(SignatureService):
    """
    Implementação simulada do serviço de assinatura para MVP.
    
    Este serviço simula o processo de assinatura digital sem se conectar
    a nenhuma API externa. Ideal para demonstrações e desenvolvimento.
    
    Na Fase 2 (Produção), esta implementação deve ser substituída por
    uma implementação real (DocuSign, D4Sign, etc.) apenas alterando
    a variável de ambiente SIGNATURE_SERVICE.
    """
    
    def __init__(self):
        logger.info("🔧 SignatureSimulatorService inicializado (Modo MVP)")
        self.email_service = EmailService()
    
    def sign_document(self, client_data: Any, contract_data: Any, pdf_path: str) -> Dict[str, Any]:
        """
        Simula a assinatura de um documento.
        
        Este método:
        1. Registra o processo de assinatura no log
        2. Simula o envio de e-mail ao cliente
        3. Marca o documento como assinado
        4. Retorna informações sobre o contrato
        """
        logger.info(f"📝 Iniciando simulação de assinatura para cliente: {client_data.nome_completo}")
        logger.info(f"📄 Contrato: {contract_data.numero_contrato}")
        logger.info(f"📧 Simulando envio de e-mail para: {client_data.email}")
        
        # Simular processo de assinatura
        contract_url = f"/contracts/{contract_data.numero_contrato}.pdf"
        
        logger.info(f"✅ Documento assinado com sucesso!")
        logger.info(f"📎 URL do contrato: {contract_url}")
        
        # Enviar e-mail real com o contrato
        import asyncio
        asyncio.create_task(
            self.email_service.send_contract_email(
                to_email=client_data.email,
                to_name=client_data.nome_completo,
                contract_number=contract_data.numero_contrato,
                plan_name=contract_data.plano_nome,
                plan_value=contract_data.plano_valor,
                pdf_path=pdf_path
            )
        )
        
        return {
            "status": "signed",
            "contract_url": contract_url,
            "signature_id": f"SIM-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "message": "Documento assinado com sucesso (simulação)",
            "signed_at": datetime.now().isoformat()
        }
    
    def check_signature_status(self, signature_id: str) -> Dict[str, Any]:
        """
        Simula a verificação do status de uma assinatura.
        
        No simulador, todas as assinaturas são consideradas concluídas.
        """
        logger.info(f"🔍 Verificando status da assinatura: {signature_id}")
        
        return {
            "signature_id": signature_id,
            "status": "completed",
            "signed": True,
            "message": "Assinatura concluída (simulação)"
        }
    
    def _simulate_email_sending(self, client_data: Any, contract_data: Any, contract_url: str):
        """
        Simula o envio de e-mail com o contrato assinado.
        
        Em produção, este método seria substituído por integração real
        com serviço de e-mail (SendGrid, AWS SES, etc.)
        """
        logger.info("=" * 80)
        logger.info("📧 SIMULAÇÃO DE E-MAIL")
        logger.info("=" * 80)
        logger.info(f"Para: {client_data.email}")
        logger.info(f"Assunto: Seu contrato foi assinado com sucesso!")
        logger.info("-" * 80)
        logger.info(f"Olá {client_data.nome_completo},")
        logger.info("")
        logger.info(f"Seu contrato {contract_data.numero_contrato} foi assinado com sucesso!")
        logger.info(f"Plano: {contract_data.plano_nome}")
        logger.info(f"Valor: {contract_data.plano_valor}")
        logger.info("")
        logger.info(f"Você pode baixar uma cópia do contrato através do link:")
        logger.info(f"{contract_url}")
        logger.info("")
        logger.info("Obrigado por escolher nossos serviços!")
        logger.info("=" * 80)

