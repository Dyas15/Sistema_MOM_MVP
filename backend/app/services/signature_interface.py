from abc import ABC, abstractmethod
from typing import Dict, Any

class SignatureService(ABC):
    """
    Interface abstrata para serviços de assinatura de documentos.
    
    Esta interface permite que diferentes implementações de serviços de assinatura
    (DocuSign, D4Sign, simulador, etc.) sejam utilizadas de forma intercambiável.
    """
    
    @abstractmethod
    def sign_document(self, client_data: Any, contract_data: Any, pdf_path: str) -> Dict[str, Any]:
        """
        Assina um documento digitalmente.
        
        Args:
            client_data: Dados do cliente
            contract_data: Dados do contrato
            pdf_path: Caminho do arquivo PDF a ser assinado
            
        Returns:
            Dict contendo:
                - status: Status da assinatura (signed, pending, failed)
                - contract_url: URL do contrato assinado
                - signature_id: ID da assinatura (se aplicável)
                - message: Mensagem adicional
        """
        pass
    
    @abstractmethod
    def check_signature_status(self, signature_id: str) -> Dict[str, Any]:
        """
        Verifica o status de uma assinatura.
        
        Args:
            signature_id: ID da assinatura a ser verificada
            
        Returns:
            Dict contendo informações sobre o status da assinatura
        """
        pass

