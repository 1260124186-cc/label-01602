# 租房信息发布与查询平台

## How to Run

### 使用 Docker Compose 一键启动（推荐）

```bash
# 克隆项目后，在根目录执行
docker-compose up --build -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止服务并清除数据
docker-compose down -v
```

启动完成后：
- 前端管理后台: http://localhost:8082
- 后端 API 服务: http://localhost:3001

### 本地开发环境

```bash
# 后端
cd backend
npm install
cp .env.example .env
# 编辑 .env 配置 MongoDB 连接
npx prisma generate
npx prisma db push
npm run dev

# 前端（新终端）
cd frontend-admin
npm install
npm run dev
```

## Services

| 服务 | 端口 | 说明 |
|------|------|------|
| frontend-admin | 8082 | 前端管理后台（用户端 + 管理端） |
| backend | 3001 | 后端 API 服务 |
| mongo | 27017 | MongoDB 数据库 |

## 测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@rental.com | admin123 |
| 普通用户 | test@rental.com | user123 |

> 注：测试账号在首次启动时由 db-seed 服务自动创建

## 题目内容

```
你是一个资深全栈工程师，请帮我初始化一个「租房信息发布与查询平台」的全栈项目骨架。 
🎯 项目背景 
这是一个面向大学生租房场景的 Web 平台，采用 用户投稿 + 管理员审核  的模式。 
平台只提供 租房信息的发布、审核和查询 ，不涉及任何交易、支付或撮合功能。 
🧱 技术栈要求 
前端框架： Next.js 14（App Router） 
语言： TypeScript 
样式：Tailwind CSS（基础即可，不追求 UI 复杂度） 
后端：Next.js API Routes 
数据库：MongoDB（使用 Prisma） 
状态管理：Zustand（只用于必要的客户端状态） 
鉴权方式：JWT（区分普通用户和管理员） 

👤 角色与权限 
普通用户（user） 
注册 / 登录 
发布租房信息 
查看自己发布的房源及其审核状态（pending / approved / rejected） 
管理员（admin） 
登录后台 
查看所有待审核房源 
审核房源（通过 / 驳回） 
修改或删除违规房源 

🏠 核心业务模型（必须体现） 
房源（House / Listing）必须包含： 
基础信息：标题、租金、地址、租房类型（整租 / 合租） 
可选信息：面积、楼层、标签、描述 
发布者（用户 ID） 
状态字段： pending | approved | rejected 
创建时间、更新时间 
👉 只有 approved  状态的房源才能被普通用户搜索和查看 

📄 页面结构（只需基础页面） 
/ ：房源列表页（仅展示审核通过的房源，支持基础筛选） 
/login  / /register ：登录注册 
/publish ：发布房源页面（需登录） 
/my-listings ：我发布的房源及状态 
/admin ：管理员审核页面（需管理员权限） 

🧠 架构要求 
使用 App Router（ app/  目录） 
合理拆分 Server Components / Client Components 
API Routes 按模块划分（auth / listings / admin） 
Prisma schema 清晰、可扩展 
权限控制逻辑清楚（中间件或 API 层校验） 

⚠️ 明确不需要的内容（请不要实现） 
不需要支付、聊天、地图、第三方平台爬虫 
不需要复杂 UI、动画或设计系统 
不需要短信、邮箱验证码 

📌 输出要求 
初始化项目目录结构 
Prisma 数据模型（User / Listing） 
基础页面和 API 骨架（可空实现） 
清晰的代码注释，方便后续扩展 
请优先保证 架构正确、业务模型清晰、可在三周内持续迭代完成 。
```

---

## 项目介绍

面向大学生租房场景的 Web 平台，采用 **用户投稿 + 管理员审核** 的模式。平台只提供租房信息的发布、审核和查询，不涉及任何交易、支付或撮合功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: MongoDB (Prisma ORM)
- **状态管理**: Zustand
- **鉴权**: JWT
- **容器化**: Docker + Docker Compose

## 功能特性

### 普通用户
- 注册 / 登录
- 发布租房信息
- 查看自己发布的房源及其审核状态（pending / approved / rejected）
- 浏览已审核通过的房源
- 筛选搜索房源（关键词、租房类型、租金范围）

### 管理员
- 登录后台
- 查看所有待审核房源
- 审核房源（通过 / 驳回）
- 修改或删除违规房源

## 项目结构

```
├── backend/                    # 后端 API 服务
│   ├── app/
│   │   └── api/               # API Routes
│   │       ├── auth/          # 认证接口
│   │       ├── listings/      # 房源接口
│   │       └── admin/         # 管理接口
│   ├── lib/                   # 工具库
│   ├── prisma/                # Prisma Schema
│   ├── types/                 # 类型定义
│   ├── Dockerfile
│   └── package.json
│
├── frontend-admin/            # 前端管理后台
│   ├── app/                   # 页面
│   │   ├── login/            # 登录页
│   │   ├── register/         # 注册页
│   │   ├── publish/          # 发布房源
│   │   ├── my-listings/      # 我的房源
│   │   ├── admin/            # 管理后台
│   │   └── listings/[id]/    # 房源详情
│   ├── components/           # 组件
│   ├── lib/                  # 工具库
│   ├── store/                # Zustand 状态管理
│   ├── Dockerfile
│   └── package.json
│
├── docs/                      # 项目文档
│   └── project_design.md     # 设计文档
│
├── docker-compose.yml         # Docker Compose 配置
├── .gitignore
└── README.md
```

## API 接口

### 认证接口 (/api/auth)

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/me | 获取当前用户信息 |

### 房源接口 (/api/listings)

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/listings | 获取已审核房源列表 |
| POST | /api/listings | 创建房源 |
| GET | /api/listings/my | 获取我的房源 |
| GET | /api/listings/[id] | 获取房源详情 |
| PUT | /api/listings/[id] | 更新房源 |
| DELETE | /api/listings/[id] | 删除房源 |

### 管理接口 (/api/admin)

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/admin/listings | 获取待审核房源 |
| PUT | /api/admin/listings/[id]/approve | 审核通过 |
| PUT | /api/admin/listings/[id]/reject | 审核驳回 |
| DELETE | /api/admin/listings/[id] | 删除违规房源 |

## 数据模型

### 用户 (User)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| email | String | 邮箱（唯一） |
| password | String | 密码（加密） |
| name | String | 用户名 |
| role | Enum | 角色（user/admin） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### 房源 (Listing)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| title | String | 标题 |
| rent | Int | 月租金 |
| address | String | 地址 |
| rentType | Enum | 类型（whole/shared） |
| area | Int? | 面积 |
| floor | String? | 楼层 |
| tags | String[] | 标签 |
| description | String? | 描述 |
| status | Enum | 状态（pending/approved/rejected） |
| rejectReason | String? | 驳回原因 |
| userId | String | 发布者 ID |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

## Docker 镜像说明

本项目使用的基础镜像均支持多架构（AMD64/ARM64）：

- `node:20-alpine` - Node.js 运行环境
- `mongo:7` - MongoDB 数据库

可以使用以下命令验证镜像的 ARM 支持：

```bash
docker pull --platform linux/arm64 node:20-alpine
docker pull --platform linux/arm64 mongo:7
```

## 许可证

MIT
