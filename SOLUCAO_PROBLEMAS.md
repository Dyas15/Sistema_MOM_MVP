# 🔧 Solução de Problemas Comuns

Este documento lista os problemas mais comuns que podem ocorrer ao executar o sistema e suas soluções.

---

## ❌ Problema 1: Erro no Build do Frontend (pnpm-lock.yaml)

### Sintoma
```
ERR_PNPM_LOCKFILE_BREAKING_CHANGE  Lockfile /app/pnpm-lock.yaml not compatible with current pnpm
Run with the --force parameter to recreate the lockfile.
```

### Causa
O arquivo `pnpm-lock.yaml` foi gerado com uma versão diferente do pnpm e é incompatível com a versão no Docker.

### Solução

**Opção 1: Remover o arquivo de lock (Recomendado para MVP)**
```bash
rm frontend/pnpm-lock.yaml
docker-compose up --build
```

**Opção 2: Forçar regeneração**
```bash
cd frontend
rm pnpm-lock.yaml
docker-compose up --build
```

O Dockerfile foi atualizado para gerar automaticamente um novo `pnpm-lock.yaml` compatível durante o build.

---

## ❌ Problema 2: Erro "/app/public: not found"

### Sintoma
```
ERROR [frontend runner 4/6] COPY --from=builder /app/public ./public
"/app/public": not found
```

### Causa
A pasta `public` não existe no projeto Next.js.

### Solução

**Já corrigido no projeto atual!** O Dockerfile foi atualizado para:
1. Criar a pasta `public` automaticamente
2. Copiar arquivos apenas se existirem
3. Usar modo simplificado sem `standalone`

Se você ainda encontrar este erro:
```bash
mkdir -p frontend/public
touch frontend/public/.gitkeep
docker-compose up --build
```

---

## ⚠️ Aviso: "version is obsolete" no docker-compose.yml

### Sintoma
```
level=warning msg="docker-compose.yml: the attribute `version` is obsolete"
```

### Causa
Docker Compose v2 não requer mais a linha `version:` no arquivo.

### Solução
Este aviso é apenas informativo e não afeta o funcionamento. O arquivo já foi atualizado para remover a linha `version:`.

Se você ainda vê o aviso, ignore-o ou atualize seu arquivo `docker-compose.yml` removendo a primeira linha `version: '3.8'`.

---

## 🐳 Problema 3: Portas Já em Uso

### Sintoma
```
Error: bind: address already in use
```

### Causa
As portas 3000 (frontend) ou 8000 (backend) já estão sendo usadas por outro processo.

### Solução

**Verificar processos usando as portas:**

Windows (PowerShell):
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

Linux/Mac:
```bash
lsof -i :3000
lsof -i :8000
```

**Parar containers antigos:**
```bash
docker-compose down
docker-compose up --build
```

**Ou alterar as portas no docker-compose.yml:**
```yaml
ports:
  - "3001:3000"  # Frontend na porta 3001
  - "8001:8000"  # Backend na porta 8001
```

---

## 📦 Problema 4: Erro ao Baixar Dependências Python

### Sintoma
```
ERROR: Could not find a version that satisfies the requirement...
```

### Causa
Problema de conectividade ou versão incompatível de pacote.

### Solução

**1. Limpar cache do Docker:**
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

**2. Verificar conexão com a internet**

**3. Tentar novamente:**
```bash
docker-compose up --build
```

---

## 🗄️ Problema 5: Banco de Dados Corrompido

### Sintoma
```
sqlite3.DatabaseError: database disk image is malformed
```

### Causa
Arquivo `database.db` corrompido.

### Solução

**Remover o banco e recriar:**
```bash
docker-compose down
rm backend/database.db
docker-compose up --build
```

**Nota:** Isso apagará todos os dados cadastrados. Para MVP isso não é problema.

---

## 📧 Problema 6: E-mails Não São Enviados

### Sintoma
Logs mostram:
```
⚠️  Credenciais SMTP não configuradas. E-mails não serão enviados.
```

### Causa
Variáveis de ambiente SMTP não configuradas.

### Solução

**1. Criar arquivo .env:**
```bash
cp .env.example .env
```

**2. Editar com suas credenciais:**
```env
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app
SMTP_FROM_EMAIL=seu-email@gmail.com
```

**3. Reiniciar containers:**
```bash
docker-compose restart
```

**Veja o guia completo:** `CONFIGURACAO_EMAIL.md`

---

## 🔐 Problema 7: Erro de Autenticação SMTP

### Sintoma
```
❌ Erro ao enviar e-mail: Authentication failed
```

### Causa
Senha de app incorreta ou verificação em duas etapas não ativada.

### Solução

**1. Verificar se a verificação em duas etapas está ativa:**
- Acesse [Google Account Security](https://myaccount.google.com/security)
- Confirme que "Verificação em duas etapas" está ativa

**2. Gerar nova senha de app:**
- Acesse [Senhas de app](https://myaccount.google.com/apppasswords)
- Gere uma nova senha
- Copie e cole no arquivo `.env`

**3. Reiniciar:**
```bash
docker-compose restart
```

---

## 🌐 Problema 8: Frontend Não Consegue Conectar ao Backend

### Sintoma
No navegador:
```
Network Error
Failed to fetch
```

### Causa
Backend não está rodando ou URL incorreta.

### Solução

**1. Verificar se o backend está rodando:**
```bash
curl http://localhost:8000/health
```

Deve retornar: `{"status":"healthy"}`

**2. Verificar logs do backend:**
```bash
docker-compose logs backend
```

**3. Verificar variável de ambiente:**
No arquivo `docker-compose.yml`, confirme:
```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://localhost:8000
```

**4. Reiniciar tudo:**
```bash
docker-compose down
docker-compose up --build
```

---

## 💾 Problema 9: Espaço em Disco Insuficiente

### Sintoma
```
ERROR: no space left on device
```

### Causa
Docker está usando muito espaço em disco.

### Solução

**Limpar imagens e containers não utilizados:**
```bash
docker system prune -a --volumes
```

**Verificar espaço usado pelo Docker:**
```bash
docker system df
```

---

## 🔄 Problema 10: Mudanças no Código Não Aparecem

### Sintoma
Alterações no código não refletem no sistema rodando.

### Causa
Docker está usando cache antigo.

### Solução

**Rebuild completo sem cache:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

---

## 📱 Problema 11: Layout Quebrado no Mobile

### Sintoma
Interface não responsiva em dispositivos móveis.

### Causa
Cache do navegador ou problema de build.

### Solução

**1. Limpar cache do navegador:**
- Chrome: Ctrl+Shift+Delete
- Firefox: Ctrl+Shift+Delete
- Safari: Cmd+Option+E

**2. Testar em modo anônimo/privado**

**3. Rebuild do frontend:**
```bash
docker-compose down
docker-compose up --build frontend
```

---

## 🐛 Problema 12: Erro "Module not found"

### Sintoma
```
Error: Cannot find module '@/components/ui/button'
```

### Causa
Dependências não instaladas corretamente.

### Solução

**Rebuild completo:**
```bash
docker-compose down
rm -rf frontend/node_modules
docker-compose up --build
```

---

## 📊 Como Ver Logs Detalhados

### Ver logs de todos os serviços:
```bash
docker-compose logs -f
```

### Ver logs apenas do backend:
```bash
docker-compose logs -f backend
```

### Ver logs apenas do frontend:
```bash
docker-compose logs -f frontend
```

### Ver últimas 100 linhas:
```bash
docker-compose logs --tail=100
```

---

## 🆘 Solução Definitiva: Reset Completo

Se nada funcionar, faça um reset completo:

```bash
# Parar tudo
docker-compose down

# Remover volumes e dados
rm -rf backend/database.db
rm -rf backend/contracts/*.pdf
rm -rf frontend/node_modules
rm -rf frontend/.next
rm -rf frontend/pnpm-lock.yaml

# Criar pasta public se não existir
mkdir -p frontend/public
touch frontend/public/.gitkeep

# Limpar Docker
docker system prune -a --volumes

# Rebuild completo
docker-compose up --build
```

---

## 📞 Suporte Adicional

Se o problema persistir:

1. **Verifique os logs detalhados:** `docker-compose logs -f`
2. **Consulte a documentação:** `README.md`, `CONFIGURACAO_EMAIL.md`
3. **Verifique requisitos do sistema:**
   - Docker: versão 20.10+
   - Docker Compose: versão 2.0+
   - Espaço em disco: mínimo 2GB livres
   - RAM: mínimo 4GB

---

## ✅ Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Docker e Docker Compose estão instalados e atualizados
- [ ] Portas 3000 e 8000 estão livres
- [ ] Arquivo `.env` está configurado (se quiser e-mails)
- [ ] Pasta `frontend/public` existe
- [ ] Há espaço suficiente em disco
- [ ] Conexão com internet está funcionando
- [ ] Logs foram verificados (`docker-compose logs -f`)
- [ ] Tentou rebuild completo (`docker-compose up --build`)

---

## 🎯 Erros Mais Comuns e Soluções Rápidas

| Erro | Solução Rápida |
|------|----------------|
| `pnpm-lock.yaml not compatible` | `rm frontend/pnpm-lock.yaml && docker-compose up --build` |
| `/app/public: not found` | `mkdir -p frontend/public && docker-compose up --build` |
| `address already in use` | `docker-compose down && docker-compose up --build` |
| `Module not found` | `docker-compose down && docker-compose up --build --no-cache` |
| `Authentication failed` (SMTP) | Verificar senha de app no `.env` |
| `Network Error` (frontend) | Verificar se backend está rodando: `curl http://localhost:8000/health` |

---

**💡 Dica:** A maioria dos problemas é resolvida com um rebuild completo: `docker-compose down && docker-compose up --build`

