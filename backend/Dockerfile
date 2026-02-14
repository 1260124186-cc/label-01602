# ============================================
# 租房平台后端 Dockerfile
# 支持 ARM64 和 AMD64 架构
# ============================================

# Stage 1: 依赖安装
FROM node:20-alpine AS deps
# node:20-alpine 官方镜像支持多架构 (linux/amd64, linux/arm64)

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
COPY prisma ./prisma/

# 安装依赖
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else npm install; \
  fi

# 生成 Prisma Client
RUN npx prisma generate

# Stage 2: 构建
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 构建应用
RUN npm run build

# Stage 3: 运行
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public

# 设置正确的权限
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 复制 standalone 输出
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制 Prisma 文件
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3001

# 设置端口环境变量
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# 启动命令
CMD ["node", "server.js"]
