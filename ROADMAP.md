# FlowForge Roadmap: Weavy Obsolescence Plan

## Current State (v0.9 - Built)

### ✅ Already Implemented

**Core Engine:**
- [x] Multi-model provider abstraction (fal.ai, Replicate, OpenAI, Mock)
- [x] Pipeline JSON definition with sequential steps
- [x] Template-based workflow system

**Outcome-First Templates (12 total):**
- [x] Full Asset Engine (20+ assets from 1 photo)
- [x] Product Gallery, Lifestyle Set, Amazon Listing Pack
- [x] Product Thumbnails, Platform-Ready Crops
- [x] Social Ad Pack, Video Ad Stills, Retargeting Ads, UGC-Style Ads
- [x] Brand Asset Pack, Seasonal Campaign Pack

**UX:**
- [x] "What do you want?" goal-based start page
- [x] Template wizard (no node graph for default users)
- [x] Advanced mode (read-only pipeline JSON view)
- [x] A/B variant labeling on outputs
- [x] Quick eval (keep/trash/more) on each asset

**Campaign from URL:**
- [x] Paste product URL → auto-scrape images, copy, brand
- [x] Pre-fill wizard from scraped data

**Bundle Outputs:**
- [x] ZIP export organized by platform (Amazon/Lifestyle/Social/Thumbnails)
- [x] Auto naming schemes and folder structures
- [x] README manifest with A/B testing guide

**Analytics & Eval:**
- [x] Per-template satisfaction tracking
- [x] Feedback system (rating + "hit the mark" + issues)
- [x] Analytics dashboard with usage stats

**Pricing & Cost:**
- [x] Transparent pricing page with tiers
- [x] Cost-per-run displayed before every workflow
- [x] Credit system with monthly limits

**API & Integration:**
- [x] Public REST API (POST /api/v1/runs, GET /api/v1/templates)
- [x] Webhooks (run.started, run.completed, run.failed)
- [x] API key management
- [x] Pipeline JSON export/import

**Auth & Users:**
- [x] NextAuth with Google OAuth + Email Magic Link
- [x] User preferences and onboarding flow
- [x] Plan tiers (Free, Starter, Pro, Enterprise)

---

## Phase 1: Launch Ready (v1.0) - 1-2 weeks

Ship with current features + these high-impact additions:

### 1.1 Inline Editing Tools (Critical Differentiator)
```
Priority: HIGH
Effort: Medium

Features:
- [ ] Simple mask painter on results (brush + eraser)
- [ ] Inpaint selected region with new prompt
- [ ] Crop and resize with aspect ratio presets
- [ ] One-click background removal
```

### 1.2 Side-by-Side Compare
```
Priority: HIGH  
Effort: Low

Features:
- [ ] Compare 2-4 outputs side by side
- [ ] Toggle A/B variants
- [ ] Swipe/slider comparison mode
```

### 1.3 Recipe Saving
```
Priority: HIGH
Effort: Low

Features:
- [ ] Save pipeline + parameters as named preset
- [ ] Per-brand recipe library
- [ ] "Use this recipe again" from results page
```

### 1.4 Cost Breakdown Per Run
```
Priority: MEDIUM
Effort: Low

Features:
- [ ] Show which models were used
- [ ] Cost contribution of each step
- [ ] "Cheaper alternative" suggestions
```

### 1.5 Client Share Mode
```
Priority: HIGH
Effort: Medium

Features:
- [ ] Generate shareable link for a run's results
- [ ] Client can view, download, leave comments
- [ ] Optional approval workflow
- [ ] Expiring links with access limits
```

---

## Phase 2: Power Features (v1.5) - 2-4 weeks

### 2.1 Advanced Pipeline Editor
```
Priority: HIGH
Effort: High

Features:
- [ ] Visual step editor (not full node graph, vertical flow)
- [ ] Add/remove/reorder steps
- [ ] Conditional branches (if quality < X, regenerate)
- [ ] Parallel execution branches
- [ ] Reusable sub-workflows / macros
```

### 2.2 Layer-Aware Editing
```
Priority: HIGH
Effort: High

Features:
- [ ] Multi-layer canvas for compositing
- [ ] Mask manipulation and refinement
- [ ] Outpainting (extend image edges)
- [ ] Relighting controls
- [ ] Z-depth tools for 3D-aware edits
```

### 2.3 Upscaling & Enhancement
```
Priority: MEDIUM
Effort: Medium

Features:
- [ ] Built-in upscaler (2x, 4x) via Replicate/fal
- [ ] Face enhancement
- [ ] Detail sharpening
- [ ] Noise reduction
```

### 2.4 Smart Resizing
```
Priority: MEDIUM
Effort: Medium

Features:
- [ ] Content-aware resize to any aspect ratio
- [ ] Safe-zone protection (keep subject centered)
- [ ] Platform preset sizes (IG Story, TikTok, Amazon, etc.)
- [ ] Batch resize all outputs
```

### 2.5 Version History
```
Priority: MEDIUM
Effort: Medium

Features:
- [ ] Time-travel per project
- [ ] Fork from any previous state
- [ ] Compare versions side by side
- [ ] Restore previous outputs
```

### 2.6 LoRA / Style Management
```
Priority: MEDIUM
Effort: High

Features:
- [ ] Upload custom LoRAs
- [ ] Style embedding library
- [ ] Apply styles to any template
- [ ] Brand-specific style packs
```

---

## Phase 3: Team & Collaboration (v2.0) - 4-6 weeks

### 3.1 Workspaces / Brand Spaces
```
Priority: HIGH
Effort: High

Features:
- [ ] Create workspaces per client/brand
- [ ] Invite team members
- [ ] Workspace-level settings (allowed models, styles)
- [ ] Shared asset library per workspace
```

### 3.2 Real-Time Collaboration
```
Priority: MEDIUM
Effort: Very High

Features:
- [ ] Multiple users editing same project
- [ ] Presence indicators (who's viewing)
- [ ] Live cursor tracking
- [ ] Conflict resolution
```

### 3.3 Comments & Annotations
```
Priority: HIGH
Effort: Medium

Features:
- [ ] Pin comments to specific outputs/regions
- [ ] @mention team members
- [ ] Resolve/unresolve threads
- [ ] Activity feed per project
```

### 3.4 Approval Workflows
```
Priority: MEDIUM
Effort: Medium

Features:
- [ ] Request approval on outputs
- [ ] Approve/reject with comments
- [ ] Approval history and audit trail
- [ ] Auto-notify stakeholders
```

### 3.5 Role-Based Permissions
```
Priority: HIGH
Effort: Medium

Features:
- [ ] Roles: Owner, Admin, Creator, Reviewer, Client
- [ ] Per-workspace permission sets
- [ ] Template access controls
- [ ] API key scoping by role
```

### 3.6 Shared Template Libraries
```
Priority: MEDIUM
Effort: Low

Features:
- [ ] Publish templates to workspace
- [ ] Fork and customize shared templates
- [ ] Template versioning
- [ ] Usage analytics per template
```

---

## Phase 4: Enterprise & Integtic (v2.5) - 6-8 weeks

### 4.1 SSO & Enterprise Auth
```
Priority: HIGH (for enterprise)
Effort: Medium

Features:
- [ ] SAML 2.0 SSO
- [ ] SCIM user provisioning
- [ ] Directory sync (Okta, Azure AD)
- [ ] MFA enforcement
```

### 4.2 Connectors & Integrations
```
Priority: HIGH
Effort: High

Features:
- [ ] Shopify: Push products → get assets → update listings
- [ ] Meta Ads: Direct upload to ad library
- [ ] Google Ads: Asset upload
- [ ] TikTok Ads: Creative upload
- [ ] Contentful/Sanity: Sync assets to CMS
- [ ] S3/GCS/R2: Cloud storage export
- [ ] Figma: Import designs, export assets
```

### 4.3 SDKs & Developer Tools
```
Priority: MEDIUM
Effort: Medium

Features:
- [ ] JavaScript/TypeScript SDK
- [ ] Python SDK
- [ ] CLI tool for automation
- [ ] Postman collection
- [ ] OpenAPI spec
```

### 4.4 Plugin Architecture
```
Priority: LOW
Effort: Very High

Features:
- [ ] Custom model provider plugins
- [ ] Custom step/node types
- [ ] Custom export formats
- [ ] Marketplace for community plugins
```

### 4.5 Audit & Compliance
```
Priority: HIGH (for enterprise)
Effort: Medium

Features:
- [ ] Detailed audit logs
- [ ] Data export for compliance
- [ ] "No training on your data" guarantees
- [ ] Data residency options
- [ ] SOC 2 compliance path
```

---

## Phase 5: Intelligence Layer (v3.0) - 8-12 weeks

### 5.1 A/B Recipe Testing
```
Priority: HIGH
Effort: Medium

Features:
- [ ] Run same inputs through different pipelines
- [ ] Statistical comparison of results
- [ ] Auto-pick winning recipes
- [ ] Performance tracking over time
```

### 5.2 External Performance Data
```
Priority: MEDIUM
Effort: High

Features:
- [ ] Connect Meta/Google/TikTok ad performance
- [ ] Correlate creative variations with CTR/conversion
- [ ] Auto-tune recipes to winning patterns
- [ ] Performance predictions for new creatives
```

### 5.3 Smart Model Router
```
Priority: MEDIUM
Effort: High

Features:
- [ ] Auto-select cheapest model that hits quality target
- [ ] Learn from user preferences
- [ ] Cost optimization recommendations
- [ ] Quality/speed/cost tradeoff sliders
```

### 5.4 Auto-Improve Recipes
```
Priority: LOW
Effort: Very High

Features:
- [ ] Learn from feedback (keep/trash patterns)
- [ ] Suggest prompt improvements
- [ ] Auto-tune parameters over time
- [ ] "This recipe improved 15% this month" notifications
```

---

## Competitive Positioning Summary

| Feature Category | Weavy | FlowForge v1 | FlowForge v2+ |
|-----------------|-------|--------------|---------------|
| Node graph editing | ✅ Full | ❌ Hidden | ✅ Optional |
| Outcome-first templates | ❌ | ✅ 12+ | ✅ 20+ |
| Campaign from URL | ❌ | ✅ | ✅ |
| Bundle exports | ❌ | ✅ | ✅ |
| A/B variant labeling | ❌ | ✅ | ✅ |
| Quick eval loop | ❌ | ✅ | ✅ |
| Template analytics | ❌ | ✅ | ✅+ |
| Transparent pricing | ❌ | ✅ | ✅ |
| Client share mode | ⚠️ App Mode | ✅ | ✅+ |
| Real-time collab | ✅ | ❌ | ✅ |
| Layer editing | ✅ | ⚠️ Basic | ✅ |
| LoRA support | ✅ | ❌ | ✅ |
| External integrations | ⚠️ Figma | ❌ | ✅ Many |
| Enterprise SSO | ✅ | ❌ | ✅ |
| Performance correlation | ❌ | ❌ | ✅ |

---

## Launch Strategy

### Day 1 Message:
> "FlowForge: The AI creative engine for people who want results, not node graphs.
> 1 photo → 20+ platform-ready assets in 90 seconds.
> Paste any product URL. Pick a template. Ship."

### Target Users:
1. **Primary:** Ecommerce sellers (Amazon, Shopify, DTC)
2. **Secondary:** Performance marketers (Meta, TikTok ads)
3. **Tertiary:** Agencies serving above

### Why Not Weavy?
> "Weavy is a canvas. FlowForge is a weapon.
> If you want to build custom workflows, use Weavy.
> If you want to ship 20 product assets in 2 minutes, use FlowForge."
