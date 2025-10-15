from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_RIGHT
from datetime import datetime
import os

class PDFGenerator:
    """
    Gerador de PDFs de contratos com design profissional.
    """
    
    def __init__(self):
        self.contracts_dir = "contracts"
        os.makedirs(self.contracts_dir, exist_ok=True)
    
    def gerar_contrato(self, cliente, contrato):
        """
        Gera um PDF de contrato profissional.
        
        Args:
            cliente: Objeto Cliente do banco de dados
            contrato: Objeto Contrato do banco de dados
            
        Returns:
            str: Caminho do arquivo PDF gerado
        """
        filename = f"{contrato.numero_contrato}.pdf"
        filepath = os.path.join(self.contracts_dir, filename)
        
        # Criar documento
        doc = SimpleDocTemplate(
            filepath,
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm
        )
        
        # Estilos
        styles = getSampleStyleSheet()
        
        # Estilo para título
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        # Estilo para subtítulos
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        # Estilo para corpo do texto
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12,
            leading=16
        )
        
        # Construir conteúdo
        story = []
        
        # Cabeçalho
        story.append(Paragraph("CONTRATO DE ADESÃO", title_style))
        story.append(Paragraph(f"Nº {contrato.numero_contrato}", subtitle_style))
        story.append(Spacer(1, 0.5*cm))
        
        # Informações do contrato
        data_atual = datetime.now().strftime("%d/%m/%Y")
        info_text = f"<b>Data de Emissão:</b> {data_atual}<br/>"
        info_text += f"<b>Plano Contratado:</b> {contrato.plano_nome}<br/>"
        info_text += f"<b>Valor:</b> {contrato.plano_valor}"
        story.append(Paragraph(info_text, body_style))
        story.append(Spacer(1, 0.5*cm))
        
        # Dados do Contratante
        story.append(Paragraph("1. DADOS DO CONTRATANTE", subtitle_style))
        
        dados_cliente = [
            ['Nome Completo:', cliente.nome_completo],
            ['CPF:', cliente.cpf],
            ['E-mail:', cliente.email],
            ['Celular:', cliente.celular],
            ['Endereço:', f"{cliente.logradouro}, {cliente.numero}"],
            ['Complemento:', cliente.complemento or 'N/A'],
            ['Bairro:', cliente.bairro],
            ['Cidade/UF:', f"{cliente.cidade}/{cliente.estado}"],
            ['CEP:', cliente.cep],
        ]
        
        if cliente.placa:
            dados_cliente.extend([
                ['', ''],
                ['<b>Dados do Veículo</b>', ''],
                ['Placa:', cliente.placa],
                ['Modelo:', cliente.modelo or 'N/A'],
                ['Marca:', cliente.marca or 'N/A'],
                ['Ano:', cliente.ano or 'N/A'],
            ])
        
        table = Table(dados_cliente, colWidths=[5*cm, 12*cm])
        table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#1e40af')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        
        story.append(table)
        story.append(Spacer(1, 0.5*cm))
        
        # Cláusulas do Contrato
        story.append(Paragraph("2. OBJETO DO CONTRATO", subtitle_style))
        story.append(Paragraph(
            "O presente contrato tem por objeto a prestação de serviços conforme o plano contratado, "
            "incluindo todos os benefícios e condições especificados na proposta comercial.",
            body_style
        ))
        
        story.append(Paragraph("3. VIGÊNCIA", subtitle_style))
        story.append(Paragraph(
            "Este contrato terá vigência de 12 (doze) meses a partir da data de assinatura, "
            "renovável automaticamente por igual período, salvo manifestação em contrário de qualquer das partes.",
            body_style
        ))
        
        story.append(Paragraph("4. VALOR E FORMA DE PAGAMENTO", subtitle_style))
        story.append(Paragraph(
            f"O valor do plano contratado é de {contrato.plano_valor}, "
            "a ser pago mensalmente através de boleto bancário ou cartão de crédito, "
            "com vencimento no dia 10 de cada mês.",
            body_style
        ))
        
        story.append(Paragraph("5. OBRIGAÇÕES DO CONTRATANTE", subtitle_style))
        story.append(Paragraph(
            "O contratante se obriga a: (a) efetuar o pagamento nas datas acordadas; "
            "(b) fornecer informações verdadeiras e atualizadas; "
            "(c) utilizar os serviços de acordo com os termos estabelecidos.",
            body_style
        ))
        
        story.append(Paragraph("6. OBRIGAÇÕES DA CONTRATADA", subtitle_style))
        story.append(Paragraph(
            "A contratada se obriga a: (a) prestar os serviços com qualidade e eficiência; "
            "(b) manter a confidencialidade das informações do contratante; "
            "(c) disponibilizar suporte técnico durante o horário comercial.",
            body_style
        ))
        
        story.append(Paragraph("7. RESCISÃO", subtitle_style))
        story.append(Paragraph(
            "O presente contrato poderá ser rescindido por qualquer das partes mediante aviso prévio "
            "de 30 (trinta) dias, sem prejuízo das obrigações já assumidas até a data da rescisão.",
            body_style
        ))
        
        story.append(Paragraph("8. FORO", subtitle_style))
        story.append(Paragraph(
            "Fica eleito o foro da comarca da sede da contratada para dirimir quaisquer dúvidas "
            "ou controvérsias oriundas do presente contrato.",
            body_style
        ))
        
        story.append(Spacer(1, 1*cm))
        
        # Assinatura
        story.append(Paragraph(
            f"Por estarem justos e contratados, assinam o presente instrumento em {data_atual}.",
            body_style
        ))
        
        story.append(Spacer(1, 1.5*cm))
        
        assinatura_style = ParagraphStyle(
            'Signature',
            parent=styles['Normal'],
            fontSize=10,
            alignment=TA_CENTER
        )
        
        story.append(Paragraph("_" * 50, assinatura_style))
        story.append(Paragraph(f"<b>{cliente.nome_completo}</b>", assinatura_style))
        story.append(Paragraph(f"CPF: {cliente.cpf}", assinatura_style))
        story.append(Paragraph("Contratante", assinatura_style))
        
        # Gerar PDF
        doc.build(story)
        
        return filepath

