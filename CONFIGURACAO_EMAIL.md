# 📧 Guia de Configuração de E-mail (SMTP do Google)

Este guia explica como configurar o envio de e-mails usando o Gmail SMTP no sistema.

---

## 🎯 Visão Geral

O sistema está configurado para enviar e-mails automaticamente quando um contrato é assinado. O e-mail inclui:

- ✅ Confirmação de assinatura do contrato
- 📄 PDF do contrato anexado
- 🎨 Design HTML profissional e responsivo
- 📋 Informações completas do plano contratado

---

## 🔐 Passo a Passo: Configurar Gmail SMTP

### 1. Ativar Verificação em Duas Etapas

1. Acesse [Google Account Security](https://myaccount.google.com/security)
2. Procure por **"Verificação em duas etapas"**
3. Clique em **"Ativar"** e siga as instruções
4. Configure usando seu celular ou app autenticador

### 2. Gerar Senha de App

Após ativar a verificação em duas etapas:

1. Volte para [Google Account Security](https://myaccount.google.com/security)
2. Procure por **"Senhas de app"** (pode estar em "Como fazer login no Google")
3. Clique em **"Senhas de app"**
4. Selecione:
   - **App:** E-mail
   - **Dispositivo:** Outro (personalizado)
   - **Nome:** "Sistema de Contratos" (ou qualquer nome)
5. Clique em **"Gerar"**
6. **COPIE A SENHA GERADA** (16 caracteres, sem espaços)
   - Exemplo: `abcd efgh ijkl mnop`
   - ⚠️ Esta senha será exibida apenas uma vez!

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (mesma pasta do `docker-compose.yml`):

```bash
# Copiar o exemplo
cp .env.example .env

# Editar com suas credenciais
nano .env
```

Configure as seguintes variáveis:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM_EMAIL=seu-email@gmail.com
SMTP_FROM_NAME=Sistema de Contratos
```

**Importante:**
- `SMTP_USER`: Seu e-mail completo do Gmail
- `SMTP_PASSWORD`: A senha de app gerada (16 caracteres, pode incluir espaços)
- `SMTP_FROM_EMAIL`: E-mail que aparecerá como remetente
- `SMTP_FROM_NAME`: Nome que aparecerá como remetente

### 4. Executar o Sistema

```bash
docker-compose up --build
```

O sistema carregará automaticamente as variáveis do arquivo `.env`.

---

## ✅ Como Testar

1. Acesse o sistema: `http://localhost:3000`
2. Complete o cadastro de um cliente
3. Finalize o processo até a tela de sucesso
4. Verifique a caixa de entrada do e-mail cadastrado
5. O e-mail deve chegar em alguns segundos com o PDF anexado

---

## 🔍 Verificar Logs

Para ver se o e-mail foi enviado com sucesso, verifique os logs do backend:

```bash
docker-compose logs -f backend
```

**Mensagens de sucesso:**
```
✅ EmailService configurado: seu-email@gmail.com
✅ E-mail enviado com sucesso para cliente@email.com
```

**Mensagens de erro:**
```
⚠️  Credenciais SMTP não configuradas. E-mails não serão enviados.
❌ Erro ao enviar e-mail para cliente@email.com: [detalhes do erro]
```

---

## 🛠️ Solução de Problemas

### Problema: "Credenciais SMTP não configuradas"

**Causa:** Variáveis de ambiente não foram carregadas.

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se as variáveis `SMTP_USER` e `SMTP_PASSWORD` estão preenchidas
3. Reinicie os containers: `docker-compose restart`

### Problema: "Authentication failed"

**Causa:** Senha de app incorreta ou não gerada.

**Solução:**
1. Verifique se a verificação em duas etapas está ativa
2. Gere uma nova senha de app
3. Copie a senha SEM espaços ou com espaços (ambos funcionam)
4. Atualize o arquivo `.env`
5. Reinicie: `docker-compose restart`

### Problema: "Connection refused" ou "Timeout"

**Causa:** Firewall ou porta bloqueada.

**Solução:**
1. Verifique se a porta 587 está aberta no firewall
2. Tente usar a porta 465 (SSL) alterando `SMTP_PORT=465`
3. Verifique sua conexão com a internet

### Problema: E-mail não chega na caixa de entrada

**Causa:** E-mail pode estar na pasta de spam.

**Solução:**
1. Verifique a pasta de **Spam/Lixo Eletrônico**
2. Marque o e-mail como "Não é spam"
3. Adicione o remetente aos contatos

---

## 🔒 Segurança

### ⚠️ IMPORTANTE: Nunca compartilhe suas credenciais!

- ❌ **NÃO** commite o arquivo `.env` no Git
- ❌ **NÃO** compartilhe a senha de app publicamente
- ✅ Use variáveis de ambiente em produção
- ✅ Revogue senhas de app antigas que não usa mais

### Revogar Senha de App

Se você suspeitar que a senha foi comprometida:

1. Acesse [Senhas de app](https://myaccount.google.com/apppasswords)
2. Encontre a senha "Sistema de Contratos"
3. Clique em **"Revogar"**
4. Gere uma nova senha e atualize o `.env`

---

## 📊 Estatísticas de E-mail

O sistema registra nos logs:
- ✅ E-mails enviados com sucesso
- ❌ Falhas no envio
- 📧 Simulações (quando SMTP não está configurado)

---

## 🚀 Modo Produção

Em ambiente de produção, configure as variáveis de ambiente diretamente no servidor:

**AWS, DigitalOcean, Heroku:**
```bash
export SMTP_USER="seu-email@gmail.com"
export SMTP_PASSWORD="sua-senha-de-app"
export SMTP_FROM_EMAIL="seu-email@gmail.com"
export SMTP_FROM_NAME="Sistema de Contratos"
```

**Docker Swarm / Kubernetes:**
Use secrets para armazenar credenciais sensíveis.

---

## 📚 Recursos Adicionais

- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [App Passwords](https://support.google.com/accounts/answer/185833)
- [Two-Step Verification](https://support.google.com/accounts/answer/185839)

---

## 💡 Dicas

1. **Use um e-mail dedicado** para o sistema (ex: `sistema@empresa.com`)
2. **Monitore os logs** regularmente para detectar problemas
3. **Teste o envio** antes de apresentar ao cliente
4. **Configure SPF/DKIM** para melhorar a entregabilidade (avançado)

---

**Desenvolvido com ❤️ para garantir a melhor experiência de comunicação com seus clientes.**

