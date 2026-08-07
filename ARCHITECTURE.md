# IdentityGraph — System Architecture & Technical Specifications

## 1. Problem Statement & Mission

### The Core Problem
Developers and professionals struggle with **fragmented, static career representations**:
1. **Static Resumes & Portfolios**: Traditional PDFs or hardcoded portfolio websites require manual updates, offer static themes, and lack structured API endpoints for programmatic access.
2. **LLM Context Disconnect**: When an AI assistant (like Claude Desktop, Antigravity, or Cursor) needs to understand a developer's full skillset, achievements, or project history, there is no standardized API protocol to request their profile data programmatically.

### The IdentityGraph Solution
IdentityGraph bridges human-facing web presentation and machine-facing AI context:
- **Relational Data Single Source of Truth**: PostgreSQL serves as the relational database mapping all profile details, experience entries, educational records, projects, and skills.
- **Model Context Protocol (MCP)**: Exposes standardized tools so any LLM can fetch the developer's full career graph programmatically in real-time.
- **Dynamic Theming**: Responsive flagship theme layout driven by a clean, centralized design token architecture.

---

## 2. Full Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  USER / CLIENT LAYER                               |
+------------------------------------------+----------------------------------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
                    v                                             v
        +-----------------------+                     +-----------------------+
        |   Public Portfolio    |                     |  Developer Dashboard  |
        |  /portfolio/[username]|                     |      /dashboard       |
        +-----------+-----------+                     +-----------+-----------+
                    |                                             |
                    +----------------------+----------------------+
                                           |
                                 Supabase Auth Token
                                 (Bearer JWT Access)
                                 |
                                 v
+-----------------------------------------------------------------------------------+
|                                Express REST API Backend                            |
|                                    (Port 3001)                                    |
|                                                                                   |
|  +------------------+     +-----------------------+     +----------------------+  |
|  |  requireAuth MS  | --> | Ownership Verification| --> | Controller Mutations |  |
|  +------------------+     +-----------------------+     +----------+-----------+  |
+--------------------------------------------------------------------|--------------+
                                                                     |
                                                                     v
                                                   +------------------------------------+
                                                   |        PostgreSQL Database         |
                                                   |   (Supabase Managed via Prisma)    |
                                                   |                                    |
                                                   |  - Profiles, Experiences, Projects |
                                                   |  - Education, Skills, User Themes  |
                                                   +-----------------+------------------+
                                                                     ^
                                                                     |
                                                                     | Relational Profile Queries
                                                                     |
                                                    +----------------+----------------+
                                                    |           MCP Server            |
                                                    |   (Model Context Protocol)      |
                                                    +----------------+----------------+
                                                                     ^
                                                                     | Standard Stdio IPC
                                                                     |
                                                    +----------------+----------------+
                                                    |       LLMs & AI Assistants      |
                                                    |  (Claude, Antigravity, Cursor)  |
                                                    +---------------------------------+
```

---

## 3. Component Deep-Dive

### A. Frontend Layer (Next.js 15 App Router)
- **Tech**: React 19, CSS Modules, Custom Token Theme Provider (`/src/styles/theme.css`).
- **Function**:
  - Authenticates users via Supabase SDK.
  - Serves an interactive CRUD Dashboard (`/dashboard`) for managing career data.
  - Serves dynamic public portfolios (`/portfolio/[username]`) with a responsive flagship design layout.
- **Optimization**: Zero hardcoded UI colors; responsive light/dark mode powered by CSS variables and `data-theme` switching.

### B. Security & Auth Layer (Supabase Auth + JWT Middleware)
- **Tech**: `@supabase/supabase-js`, Express `requireAuth` Middleware.
- **Function**:
  - Handles Email/Password sign-ups.
  - Intercepts mutating API requests, extracts the `Bearer <token>`, verifies the session against Supabase Auth API, and attaches `req.user`.
  - Ensures strict **Row-Level Ownership**: `profile.id` equals `user.id`.

### C. Relational Data Layer (PostgreSQL + Prisma)
- **Tech**: PostgreSQL (Supabase Managed), Prisma ORM v7.
- **Function**:
  - Acts as the primary **Source of Truth** for structured tables (`Profile`, `Experience`, `Education`, `Project`, `Skill`).
  - Ensures ACID transactions and fast relational lookups.

### D. AI Integration Layer (MCP Server)
- **Tech**: `@modelcontextprotocol/server`.
- **Function**:
  - Connects AI assistants (Claude Desktop, Cursor, Antigravity) to IdentityGraph via `stdio` transport.
  - Exposes tools:
    - `get_profile`: Fetches raw JSON profile details directly from Postgres.
    - `generate_formatted_resume`: Converts profile details into a clean Markdown resume document.

---

## 4. Performance & Latency Benchmarks

IdentityGraph is architected for **zero UI blocking**:

| Operation | Path / Mechanism | Expected Latency | UX Impact |
| :--- | :--- | :--- | :--- |
| **REST API Read (Profile / Portfolio)** | Next.js → Express → PostgreSQL (Prisma Index) | **< 15 ms** | Instant page loads for portfolio visitors. |
| **REST API Write / Update** | Next.js → Express → PostgreSQL Write | **< 25 ms** | Instant user save response in Dashboard. |
| **MCP Local Tool Execution** | LLM Client ↔ MCP Server (`stdio` IPC) | **< 5 ms** | Seamless local tool invocation. |

### Why this design is hyper-fast:
1. **Direct Database Lookups**: Serves strict ID lookups instantly directly from Postgres index structures.
2. **Standardized Protocol**: Uses Model Context Protocol for immediate command-line transport, avoiding network roundtrip times when executed locally by AI desktop integrations.

---

## 5. Environment Variables & Setup Quick Reference

```env
# Backend (.env)
PORT=3001
DATABASE_URL="postgresql://postgres.hnjtqvbuglpygqtyenta:..."
DIRECT_URL="postgresql://postgres.hnjtqvbuglpygqtyenta:..."
SUPABASE_URL="https://hnjtqvbuglpygqtyenta.supabase.co"
SUPABASE_ANON_KEY="eyJhbGci..."

# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL="https://hnjtqvbuglpygqtyenta.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
NEXT_PUBLIC_API_URL="http://localhost:3001"
```
