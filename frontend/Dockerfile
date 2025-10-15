FROM node:20-alpine AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Habilitar pnpm
RUN corepack enable pnpm

# Copiar arquivos de dependências
COPY package.json ./

# Instalar dependências
RUN pnpm install

# Rebuild do código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilitar telemetria durante build
ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm run build

# Imagem de produção simplificada
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar todos os arquivos necessários do builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npx", "next", "start"]

