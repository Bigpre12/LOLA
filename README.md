# LOLA – AI Creative Engine for Teams

LOLA is an AI creative workflow engine that turns a single asset into a full campaign. It's built as a simpler, outcome-first alternative to Weavy / Figma Weave: **Weavy-level power, without the node graph overhead**.

Upload one product photo or hero asset, pick a recipe, and LOLA generates ready-to-ship galleries, lifestyle sets, ad packs, and social visuals in a single run.

---

## Why LOLA exists

Modern AI tools like Weavy make it possible to chain multiple image, video, and 3D models with editing tools in a single canvas. But most creators and teams hit three problems fast:

- They don't have time to design and maintain complex node graphs.
- Credit-based pricing across many models is hard to predict.
- There's no built-in feedback loop to learn which recipes actually work.

LOLA solves this by giving you **pre-wired recipes for specific outcomes** (ecommerce, ads, brand systems) and hiding orchestration complexity behind a clean, goal-based UI.

---

## Core features

### Outcome-first templates

LOLA ships with opinionated templates instead of a blank canvas:

- **Full Asset Engine** – 20+ images from one product photo (Amazon gallery, lifestyle, social ads, thumbnails)
- **Product Gallery** – Multi-angle studio shots for marketplaces
- **Lifestyle Set** – Transform studio shots into contextual scenes
- **Social Ad Pack** – Platform-ready ads from hero + tagline
- **Background Swap** – Place products in any environment
- *(Planned)* Brand system from logo + website

Each template is a multi-step pipeline that routes through the right models and editing tools without exposing you to raw graphs.

### Multi-model orchestration

Under the hood, LOLA is built to connect many AI models via a unified interface, similar to how Weavy combines multiple providers and tools in one workflow.

**Currently supported (20+ models):**

| Provider | Models |
|----------|--------|
| Fal.ai | Flux Dev, Flux Schnell, Flux Pro, SDXL, SD3 |
| Replicate | SDXL, Flux Dev, Flux Schnell |
| OpenAI | DALL-E 3, DALL-E 3 HD, GPT-4o |
| Together AI | Flux Schnell (free), SDXL Turbo |
| Stability | SD3 Turbo, Upscale |
| Ideogram | V2, V2 Turbo (best for text-in-image) |
| Video | Runway Gen-3, Kling, Luma, Pika |

**Architecture:**

- **Model Registry** – Describes available models, capabilities, and costs
- **Provider Adapters** – Translate LOLA's generic calls into provider APIs
- **Custom HTTP Adapter** – Plug in rare/niche models with just config (no code)
- **Auto-routing** – Select best model by type, speed, quality, or cost

Workflows reference models via internal IDs, so you can swap implementations or providers without touching template logic.

### Bundled outputs, not just single shots

Instead of giving you one image per prompt, LOLA focuses on **campaign-ready bundles**:

- Zipped packs organized by platform (Amazon, Shopify, IG, TikTok, etc.)
- Correct sizes and filenames for each placement
- A/B variant tagging (angle, background, hook) to streamline testing
- README manifest with testing instructions included in every bundle

This makes LOLA feel like a production engine rather than a toy "image generator."

### Simple, powerful UX

LOLA's UI is optimized for speed:

- **Goal-based onboarding** – "What do you want to make today?"
- **URL scraping** – Paste a product URL, LOLA extracts images and copy automatically
- **Template wizard** – Fill inputs, pick options, run
- **Live preview** – Side-by-side variants with quick eval (keep/trash/more)
- **Compare view** – Slider, grid, and side-by-side modes
- **"Under the hood" view** – Shows pipeline JSON for power users

You get Weavy-style orchestration benefits without needing to wire your own graph.

### Feedback, evals, and learning

To move beyond "try prompts until it feels right," LOLA bakes in an eval loop:

- Per-asset feedback (keep / trash / needs more)
- Template-level ratings and satisfaction tracking
- Analytics dashboard with top templates and user activity
- Early support for A/B recipe testing across the same inputs

Over time, this enables smarter defaults and better templates for real campaigns.

### Team & sharing features

- **Client Share Mode** – Generate shareable links with optional password, expiration, download permissions
- **Recipe Saving** – Save your favorite input configurations as reusable presets
- **API + Webhooks** – Full REST API with run status webhooks for automation
- **Pipeline Export/Import** – Share templates as JSON files

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Auth** | NextAuth v5 (Google OAuth, Magic Links) |
| **Database** | Supabase (PostgreSQL) + Prisma ORM |
| **Storage** | Supabase Storage |
| **AI Layer** | Unified model abstraction with 6 provider adapters |

---

## Project structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Sign-in, sign-up
│   ├── (dashboard)/       # Main app pages
│   ├── api/               # API routes (runs, templates, webhooks)
│   ├── start/             # Goal-based entry point
│   └── share/             # Public share pages
├── components/
│   ├── ui/                # Base components (Button, Card, etc.)
│   ├── wizard/            # Run wizard, input renderer
│   ├── results/           # Output gallery, compare view, eval
│   └── marketing/         # Landing page sections
└── lib/
    ├── models/            # Unified AI model layer
    │   ├── types.ts       # Type definitions
    │   ├── registry.ts    # 20+ pre-configured models
    │   ├── router.ts      # Model selection & routing
    │   └── adapters/      # Provider implementations
    └── pipeline/          # Workflow execution engine
```

---

## Quick start

```bash
# Clone
git clone https://github.com/Bigpre12/LOLA.git
cd LOLA

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your credentials

# Database
npm run db:generate
npm run db:push
npm run db:seed

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Required environment variables

```env
# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# AI Providers (at least one)
TOGETHER_API_KEY="..."     # Flux Schnell is FREE
FAL_KEY="..."              # $10 free credits
OPENAI_API_KEY="..."
REPLICATE_API_TOKEN="..."
```

---

## Deploy to Railway

LOLA is configured for one-click Railway deployment.

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Deploy on Railway

1. Go to [Railway](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select `Bigpre12/LOLA`
3. Railway auto-detects Next.js and configures the build

### 3. Add environment variables

In Railway → your service → **Variables**, add:

```env
# Required
DATABASE_URL=postgresql://...          # Use Railway Postgres or Supabase
DIRECT_URL=postgresql://...            # Same as DATABASE_URL for Railway Postgres
NEXTAUTH_SECRET=your-secret-here       # Generate: openssl rand -base64 32
NEXTAUTH_URL=https://your-app.up.railway.app

# AI Provider (at least one)
TOGETHER_API_KEY=...                   # FREE tier available
FAL_KEY=...                            # $10 free credits

# Optional but recommended
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
NODE_ENV=production
```

### 4. Add a database

**Option A: Railway Postgres**
- Click **New** → **Database** → **PostgreSQL**
- Railway auto-injects `DATABASE_URL`

**Option B: Supabase**
- Create a project at [supabase.com](https://supabase.com)
- Copy the connection strings to Railway variables

### 5. Run database migrations

After first deploy, in Railway CLI or dashboard terminal:

```bash
npx prisma db push
npx prisma db seed
```

Your LOLA instance is now live at `https://your-app.up.railway.app`!

---

## LOLA vs Weavy

| | Weavy | LOLA |
|---|---|---|
| **Interface** | Node graphs | One-click recipes |
| **Learning curve** | Hours | Minutes |
| **E-commerce focus** | Generic | Purpose-built templates |
| **Pricing** | Per-seat subscription | Pay-per-run |
| **Self-hosting** | No | Yes (open source) |
| **API access** | Limited | Full REST API + webhooks |
| **Model flexibility** | Fixed providers | 20+ models, bring your own |

---

## Status & roadmap

LOLA is in active development as an experimental alternative to Weavy / Figma Weave for ecommerce and ad-focused teams.

### Implemented (v1.0)
- [x] Template-first workflow engine
- [x] Unified model layer (20+ models, 6 providers)
- [x] Full Asset Engine (20+ outputs from 1 photo)
- [x] URL scraping for auto-fill
- [x] Platform-organized bundle exports
- [x] Client share mode
- [x] Recipe saving
- [x] Side-by-side compare view
- [x] Feedback & analytics system
- [x] Public API + webhooks

### Planned (v1.5)
- [ ] Inline editing (mask painter, inpaint, crop)
- [ ] Brand kit storage
- [ ] Batch processing
- [ ] Cost breakdown per run

### Future (v2.0)
- [ ] Video generation pipelines
- [ ] Team workspaces
- [ ] Template marketplace
- [ ] Figma/Canva plugins

---

## License

MIT License – see [LICENSE](LICENSE) for details.

---

## Links

- **GitHub**: [github.com/Bigpre12/LOLA](https://github.com/Bigpre12/LOLA)
- **Issues**: [Report bugs or request features](https://github.com/Bigpre12/LOLA/issues)

---

<p align="center">
  <strong>LOLA – Launch One, Land All</strong><br>
  <em>Upload one asset. Get your whole campaign.</em>
</p>
