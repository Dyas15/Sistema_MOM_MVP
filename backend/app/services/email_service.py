import os
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from pathlib import Path
import aiosmtplib

logger = logging.getLogger(__name__)

class EmailService:
    """
    Serviço de envio de e-mails usando SMTP do Google (Gmail).
    
    Configuração necessária:
    1. Ativar "Verificação em duas etapas" na conta Google
    2. Gerar uma "Senha de app" em https://myaccount.google.com/apppasswords
    3. Configurar as variáveis de ambiente:
       - SMTP_HOST (padrão: smtp.gmail.com)
       - SMTP_PORT (padrão: 587)
       - SMTP_USER (seu e-mail do Gmail)
       - SMTP_PASSWORD (senha de app gerada)
       - SMTP_FROM_EMAIL (e-mail remetente)
       - SMTP_FROM_NAME (nome do remetente)
    """
    
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("SMTP_FROM_EMAIL", self.smtp_user)
        self.from_name = os.getenv("SMTP_FROM_NAME", "Sistema de Contratos")
        
        # Verificar se as credenciais estão configuradas
        if not self.smtp_user or not self.smtp_password:
            logger.warning("⚠️  Credenciais SMTP não configuradas. E-mails não serão enviados.")
            self.enabled = False
        else:
            self.enabled = True
            logger.info(f"✅ EmailService configurado: {self.from_email}")
    
    async def send_contract_email(
        self,
        to_email: str,
        to_name: str,
        contract_number: str,
        plan_name: str,
        plan_value: str,
        pdf_path: str
    ) -> bool:
        """
        Envia e-mail com o contrato assinado anexado.
        
        Args:
            to_email: E-mail do destinatário
            to_name: Nome do destinatário
            contract_number: Número do contrato
            plan_name: Nome do plano contratado
            plan_value: Valor do plano
            pdf_path: Caminho do arquivo PDF do contrato
            
        Returns:
            bool: True se enviado com sucesso, False caso contrário
        """
        if not self.enabled:
            logger.warning(f"📧 E-mail não enviado para {to_email} (serviço desabilitado)")
            self._log_email_simulation(to_email, to_name, contract_number, plan_name, plan_value)
            return False
        
        try:
            # Criar mensagem
            message = MIMEMultipart()
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email
            message["Subject"] = f"✅ Contrato Assinado - {contract_number}"
            
            # Corpo do e-mail em HTML
            html_body = self._create_email_html(to_name, contract_number, plan_name, plan_value)
            message.attach(MIMEText(html_body, "html", "utf-8"))
            
            # Anexar PDF do contrato
            if os.path.exists(pdf_path):
                with open(pdf_path, "rb") as pdf_file:
                    pdf_attachment = MIMEApplication(pdf_file.read(), _subtype="pdf")
                    pdf_attachment.add_header(
                        "Content-Disposition",
                        "attachment",
                        filename=f"{contract_number}.pdf"
                    )
                    message.attach(pdf_attachment)
            
            # Enviar e-mail via SMTP
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_password,
                start_tls=True,
            )
            
            logger.info(f"✅ E-mail enviado com sucesso para {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erro ao enviar e-mail para {to_email}: {str(e)}")
            # Em caso de erro, logar simulação para não perder informação
            self._log_email_simulation(to_email, to_name, contract_number, plan_name, plan_value)
            return False
    
    def _create_email_html(
        self,
        to_name: str,
        contract_number: str,
        plan_name: str,
        plan_value: str
    ) -> str:
        """
        Cria o corpo do e-mail em HTML com design profissional.
        """
        first_name = to_name.split()[0]
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 10px 10px 0 0;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                }}
                .content {{
                    background: #ffffff;
                    padding: 30px;
                    border: 1px solid #e5e7eb;
                    border-top: none;
                }}
                .contract-info {{
                    background: #f3f4f6;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }}
                .contract-info h3 {{
                    margin-top: 0;
                    color: #2563eb;
                }}
                .info-row {{
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }}
                .info-row:last-child {{
                    border-bottom: none;
                }}
                .info-label {{
                    font-weight: 600;
                    color: #6b7280;
                }}
                .info-value {{
                    color: #111827;
                }}
                .success-badge {{
                    background: #10b981;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    display: inline-block;
                    font-weight: 600;
                    margin: 10px 0;
                }}
                .footer {{
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 0 0 10px 10px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                }}
                .button {{
                    display: inline-block;
                    background: #2563eb;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                    font-weight: 600;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 Parabéns, {first_name}!</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;">Seu contrato foi assinado com sucesso</p>
            </div>
            
            <div class="content">
                <p>Olá <strong>{to_name}</strong>,</p>
                
                <p>É com grande satisfação que confirmamos a assinatura do seu contrato. Agora você já pode aproveitar todos os benefícios do seu plano!</p>
                
                <div class="contract-info">
                    <h3>📄 Informações do Contrato</h3>
                    <div class="info-row">
                        <span class="info-label">Número do Contrato:</span>
                        <span class="info-value"><strong>{contract_number}</strong></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Plano:</span>
                        <span class="info-value">{plan_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Valor:</span>
                        <span class="info-value"><strong>{plan_value}</strong></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="success-badge">✓ Assinado</span>
                    </div>
                </div>
                
                <p><strong>📎 Anexo:</strong> Uma cópia do seu contrato está anexada a este e-mail em formato PDF. Guarde este documento para referência futura.</p>
                
                <p>Se você tiver alguma dúvida ou precisar de assistência, nossa equipe está à disposição para ajudá-lo.</p>
                
                <p style="margin-top: 30px;">Atenciosamente,<br><strong>Equipe de Contratos</strong></p>
            </div>
            
            <div class="footer">
                <p>Este é um e-mail automático. Por favor, não responda.</p>
                <p style="margin: 5px 0;">© 2025 Sistema de Contratos. Todos os direitos reservados.</p>
            </div>
        </body>
        </html>
        """
        return html
    
    def _log_email_simulation(
        self,
        to_email: str,
        to_name: str,
        contract_number: str,
        plan_name: str,
        plan_value: str
    ):
        """
        Registra no log uma simulação de envio de e-mail.
        Útil quando o serviço está desabilitado ou em caso de erro.
        """
        logger.info("=" * 80)
        logger.info("📧 SIMULAÇÃO DE E-MAIL (SMTP não configurado ou erro no envio)")
        logger.info("=" * 80)
        logger.info(f"Para: {to_email}")
        logger.info(f"Assunto: ✅ Contrato Assinado - {contract_number}")
        logger.info("-" * 80)
        logger.info(f"Olá {to_name},")
        logger.info("")
        logger.info(f"Seu contrato {contract_number} foi assinado com sucesso!")
        logger.info(f"Plano: {plan_name}")
        logger.info(f"Valor: {plan_value}")
        logger.info("")
        logger.info("Uma cópia do contrato está anexada (PDF).")
        logger.info("")
        logger.info("Obrigado por escolher nossos serviços!")
        logger.info("=" * 80)

