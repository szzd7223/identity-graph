# 🚀 IdentityGraph

> **The Unified Career Profile & AI Context Substrate.**  
> Transform your career portfolio into a live presentation platform for humans and a high-performance Knowledge Graph for AI models via the **Model Context Protocol (MCP)** & **HydraDB**.

[![Architecture Docs](https://img.shields.io/badge/Architecture-View%20Doc-blue?style=for-the-badge)](./ARCHITECTURE.md)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#)

---

## 🎯 What Problem Does IdentityGraph Solve?

1. **Fragmented & Static Career Data**: Traditional portfolios and PDF resumes are static documents. Updating them is painful, and they can't be queried programmatically by modern AI applications.
2. **AI Context Disconnect & Hallucinations**: When you ask an AI assistant (like Claude Desktop, Antigravity, or Cursor) about a developer's specific background, past accomplishments, or skill depth, generic LLMs lack verified context or hallucinate.
3. **The Storage vs. Semantic Search Tradeoff**: Relational databases (PostgreSQL) are great for strict user CRUD operations but fail at natural language queries. Vector/Graph databases (HydraDB) are great for AI search but aren't intended to power transactional web UI forms.

### ✨ The IdentityGraph Solution
IdentityGraph combines both worlds seamlessly:
- **Dual Engine Core**: PostgreSQL stores exact relational user data; **HydraDB** automatically index-syncs career history into an AI-native Knowledge Graph in the background.
- **Model Context Protocol (MCP)**: Any LLM can query your career graph via standardized tools (`search_career_hydradb`, `get_profile`, `generate_formatted_resume`).
- **Dynamic Theming**: Next.js 15 frontend featuring customizable theme layouts (*Minimalist*, *Material UI Tiles*, *Nothing Phone*) and a centralized Light/Dark design token system.

---

## ⚡ How Fast Is It?

IdentityGraph is engineered for **zero UI latency**:

| Path | Benchmark | User Experience |
| :--- | :--- | :--- |
| **Portfolio Page Load** | **< 15 ms** | Instant public portfolio rendering from PostgreSQL cache |
| **Dashboard Form Save** | **< 25 ms** | Instant response — user writes complete immediately |
| **HydraDB Context Sync** | **Async Background Task** | **0 ms UI impact** — HydraDB ingests context in the background |
| **AI Semantic Search (MCP)** | **30 – 80 ms** | Real-time hybrid vector + graph context retrieval for LLMs |

> 📖 **Read the complete performance benchmarks and flow breakdown in [ARCHITECTURE.md](./ARCHITECTURE.md).**

---

## 🏗️ Architecture Overview

```
[ Frontend: Next.js 15 ] ---> [ Express REST API ] ---> [ PostgreSQL (Prisma) ]
                                      |
                           (Async Background Sync)
                                      v
 [ LLM / AI Clients ] <---> [ MCP Server ] <---> [ HydraDB Context Layer ]
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v20+` & `npm`
- PostgreSQL database (or Supabase instance)
- HydraDB API Key & Database

### 1. Clone & Install Dependencies
```powershell
# Clone the repository
git clone https://github.com/your-username/identity-graph.git
cd identity-graph

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create `backend/.env`:
```env
PORT=3001
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
HYDRA_API_KEY="sk_live_..."
HYDRA_DATABASE="identity-graph-hydradb"
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Run Database Migrations
```powershell
cd backend
npx prisma migrate dev --name init
```

### 4. Start Development Servers

In terminal 1 (Backend API):
```powershell
cd backend
npm run dev
```

In terminal 2 (Frontend Web App):
```powershell
cd frontend
npm run dev
```

In terminal 3 (MCP Server for AI assistants):
```powershell
cd backend
npm run dev:mcp
```

---

## 🛠️ MCP Tools Exposed to AI Assistants

IdentityGraph exposes the following Model Context Protocol (MCP) tools:

| MCP Tool Name | Description |
| :--- | :--- |
| `search_career_hydradb` | Performs hybrid vector + knowledge graph search over developer context via HydraDB |
| `get_profile` | Retrieves full JSON profile details including experiences, projects, skills, education |
| `search_experience` | Filters experiences and skills by keyword terms |
| `generate_formatted_resume` | Generates a clean Markdown resume formatted on-the-fly |

---

## 📄 License & Contribution

Distributed under the MIT License. See [ARCHITECTURE.md](./ARCHITECTURE.md) for deeper technical specifications.
