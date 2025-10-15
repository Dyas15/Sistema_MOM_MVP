'''
# Sistema de Cadastro e Contratos (MVP Premium)

Este é um projeto de **Prova de Conceito (PoC/MVP)** para um sistema web de cadastro de clientes e geração de contratos de adesão. O foco principal é uma **experiência de usuário (UX) impecável** e uma arquitetura robusta e escalável, pronta para evoluir para um sistema de produção.

O projeto foi totalmente containerizado com **Docker e Docker Compose**, permitindo que toda a aplicação (frontend, backend e banco de dados) seja iniciada com um único comando, sem a necessidade de instalar dependências manualmente na máquina local.

---

## ✨ Features e Stack Técnica

### 🎨 Frontend (Interface Premium)

Construído com o que há de mais moderno em desenvolvimento web para garantir uma experiência fluida, bonita e profissional.

- **Framework:** **Next.js 14** (App Router)
- **Linguagem:** **TypeScript**
- **Design System:** **Shadcn/ui** e **Radix UI** para componentes acessíveis e de alta qualidade.
- **Estilização:** **Tailwind CSS** para um design moderno e responsivo (Mobile-First).
- **Animações:** **Framer Motion** para transições suaves e microinterações elegantes.
- **Formulários:** **React Hook Form** com validação **Zod** para uma UX superior.
- **Notificações:** **Sonner** para toasts ricos e informativos.
- **Ícones:** **Lucide React**.

### ⚙️ Backend (API Robusta)

Uma API Python rápida, moderna e confiável, pronta para escalar.

- **Framework:** **FastAPI**
- **Linguagem:** **Python 3.11**
- **Banco de Dados:** **SQLite** (para o MVP, facilmente migrável para PostgreSQL).
- **ORM:** **SQLAlchemy** para uma abstração segura e eficiente do banco de dados.
- **Validação:** **Pydantic** para garantir a integridade dos dados.
- **Geração de PDF:** **ReportLab** para criar contratos profissionais dinamicamente.
- **E-mail:** **aiosmtplib** para envio de e-mails via SMTP do Google (Gmail) com anexos.
- **Assinatura (MVP):** Módulo `SignatureSimulatorService` que simula o processo de assinatura e envia e-mails reais com o contrato anexado, permitindo a troca futura por um serviço real (DocuSign, D4Sign) sem alterar o código principal.

### 🐳 Deploy e Orquestração

- **Containerização:** **Docker**
- **Orquestração Local:** **Docker Compose**

---

## 🚀 Como Executar o Projeto

Para rodar a aplicação, você precisa ter o **Docker** e o **Docker Compose** instalados em sua máquina.

### Passo 1: Configurar E-mail (Opcional mas Recomendado)

O sistema envia e-mails automáticos com o contrato assinado. Para ativar esta funcionalidade:

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Configure suas credenciais do Gmail:**
   - Edite o arquivo `.env`
   - Preencha `SMTP_USER` com seu e-mail do Gmail
   - Preencha `SMTP_PASSWORD` com uma senha de app do Google
   - Veja o guia completo em `CONFIGURACAO_EMAIL.md`

**Nota:** Se você não configurar o e-mail, o sistema funcionará normalmente, mas os e-mails serão apenas simulados nos logs.

### Passo 2: Executar a Aplicação

1.  **Clone o repositório** ou descompacte os arquivos em um diretório de sua preferência.

2.  **Abra um terminal** na raiz do projeto (na mesma pasta onde o arquivo `docker-compose.yml` está localizado).

3.  **Execute o seguinte comando:**

    ```bash
    docker-compose up --build
    ```

    - O comando `--build` garante que as imagens Docker serão construídas do zero na primeira vez.
    - O processo pode levar alguns minutos na primeira execução, pois o Docker irá baixar as imagens base e instalar todas as dependências.

4.  **Acesse a aplicação:**

    - **Frontend:** Abra seu navegador e acesse [**http://localhost:3000**](http://localhost:3000)
    - **Backend (API Docs):** Você pode ver a documentação interativa da API em [**http://localhost:8000/docs**](http://localhost:8000/docs)

---

## 📂 Estrutura do Projeto

```
sistema-cadastro-contratos/
├── docker-compose.yml      # Orquestra os serviços
├── README.md               # Este arquivo
├── frontend/               # Aplicação Next.js (UI)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── backend/                # Aplicação FastAPI (API)
    ├── Dockerfile
    ├── requirements.txt
    ├── main.py
    └── app/                # Código fonte da API
```

---

## 🎯 Fluxo da Aplicação

1.  **Tela de Boas-Vindas:** Apresenta o plano e um CTA claro para iniciar o cadastro.
2.  **Formulário Inteligente:** Um formulário multi-etapas com barra de progresso, validação em tempo real e busca de CEP automática.
3.  **Tela de Revisão:** Todos os dados inseridos são exibidos para confirmação do usuário.
4.  **Aceite de Termos:** O usuário deve marcar a caixa de aceite para poder prosseguir.
5.  **Simulação de Assinatura:** O backend gera o PDF do contrato, simula a assinatura e o envio de e-mail.
6.  **Tela de Sucesso:** Confirmação final com uma animação de confetti, informações do contrato e um botão para baixar o PDF gerado.

---

## 🔧 Próximos Passos (Fase 2)

- Substituir o `SignatureSimulatorService` por uma integração real (ex: D4Sign, DocuSign).
- Trocar o banco de dados SQLite por PostgreSQL ou MySQL alterando a variável de ambiente `DATABASE_URL`.
- Implementar um serviço de envio de e-mails real (ex: AWS SES, SendGrid).
- Desenvolver o painel administrativo para gerenciamento de clientes e contratos.
- Realizar o deploy em um ambiente de nuvem (ex: AWS, Vercel, DigitalOcean).
'''
