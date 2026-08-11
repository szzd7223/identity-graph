# IdentityGraph

> **The Unified Career Profile & AI Context Substrate.**  
> Transform your career portfolio into a live presentation platform for humans and a high-performance Knowledge Graph for AI models via the **Model Context Protocol (MCP)**.

[![Architecture Docs](https://img.shields.io/badge/Architecture-View%20Doc-blue?style=for-the-badge)](./ARCHITECTURE.md)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#)

---

## Documentation Index

Explore the complete documentation for IdentityGraph:

- **[System Architecture & Technical Specifications](./ARCHITECTURE.md)**: System design, security model, performance benchmarks, and data flow.
- **[Backend Architecture & API Specs](./backend/README.md)**: Express server details, Prisma ORM schema, Gemini resume parser engine, and MCP endpoints.
- **[Project Status & Progress Report](./STATUS.md)**: Current completion status, verified metrics, component matrix, and upcoming roadmap.
- **[Frontend Web Application](./frontend/README.md)**: Next.js 15 App Router structure, Radix UI layout, and styling instructions.
- **[Sample Resume Data](./mock_resume.md)**: Sample test resume used for AI resume parser validation.

---

## What Problem Does IdentityGraph Solve?

1. **Fragmented & Static Career Data**: Traditional portfolios and PDF resumes are static documents. Updating them is painful, and they can't be queried programmatically by modern AI applications.
2. **AI Context Disconnect & Hallucinations**: When you ask an AI assistant (like Claude Desktop, Antigravity, or Cursor) about a developer's specific background, past accomplishments, or skill depth, generic LLMs lack verified context or hallucinate.
3. **The Dual Presentation Problem**: Human visitors require interactive, beautiful web UI layouts. Machine AI assistants require structured, machine-readable JSON endpoints and protocol integrations.

### The IdentityGraph Solution
IdentityGraph combines both worlds seamlessly:
- **Relational Data Single Source of Truth**: PostgreSQL stores exact relational user data (Profiles, Experiences, Education, Projects, Skills) with full row-level ownership.
- **Model Context Protocol (MCP)**: Any LLM can query your career graph via standardized tools (`get_profile`, `search_experience`, `generate_formatted_resume`).
- **Dynamic Theming**: Next.js 15 frontend featuring customizable theme layouts (*Minimalist*, *Material UI Tiles*, *Nothing Phone*) and a centralized Light/Dark design token system.

---

## Performance Benchmarks

IdentityGraph is engineered for low UI latency:

| Path | Benchmark | User Experience |
| :--- | :--- | :--- |
| **Portfolio Page Load** | **< 15 ms** | Instant public portfolio rendering from database cache |
| **Dashboard Form Save** | **< 25 ms** | Instant response — user writes complete immediately |
| **AI Context Query (MCP)** | **30 – 80 ms** | Real-time context retrieval for LLM assistants |

> Read the complete performance benchmarks and flow breakdown in **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

---

## Architecture Overview

```text
[ Frontend: Next.js 15 ] ---> [ Express REST API ] ---> [ PostgreSQL (Prisma) ]
                                      |
                           (Bearer JWT Verification)
                                      v
 [ LLM / AI Clients ] <---> [ MCP Server ] <---> [ Relational Profile Substrate ]
```

---

## Quick Start Guide

### Prerequisites
- Node.js `v20+` & `npm`
- PostgreSQL database (or Supabase instance)
- Google Gemini API Key

### 1. Clone & Install Dependencies
```powershell
# Clone the repository
git clone https://github.com/your-username/identity-graph.git
cd identity-graph

# Install root dependencies
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
GEMINI_API_KEY="AIzaSy..."
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Run Database Sync & Client Generation
```powershell
cd backend
npx prisma db push
```

### 4. Start Development Servers

In terminal 1 (Backend REST API & MCP Server):
```powershell
cd backend
npm run dev
```

In terminal 2 (Frontend Web App):
```powershell
cd frontend
npm run dev
```

---

## MCP Tools Exposed to AI Assistants

IdentityGraph exposes the following Model Context Protocol (MCP) tools:

| MCP Tool Name | Description |
| :--- | :--- |
| `get_profile` | Retrieves full JSON profile details including experiences, projects, skills, education |
| `search_experience` | Filters experiences and skills by keyword terms |
| `generate_formatted_resume` | Generates a clean Markdown resume formatted on-the-fly |

---

## License & Contribution

Distributed under the MIT License. See **[ARCHITECTURE.md](./ARCHITECTURE.md)** and **[backend/README.md](./backend/README.md)** for detailed technical specifications.
