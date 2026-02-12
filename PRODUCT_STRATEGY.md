# Garden Living Product Blueprint

## Product North Star
**Build the daily habit loop for gardeners:**
1. **Observe** (AI scan, weather, growth timeline)
2. **Act** (water, prune, sow, swap)
3. **Share** (post, ask, mentor)
4. **Earn** (streaks, reputation, marketplace trust)
5. **Plan next step** (smart scheduler + seasonal goals)

### Core KPI Stack
- **Daily Active Gardeners (DAG):** users logging at least one garden action/day.
- **7-day task completion rate:** scheduled care tasks completed in 7 days.
- **Community contribution rate:** % of users posting, answering, or swapping weekly.
- **Verified outcomes:** disease diagnosis confirmations, accepted Q&A answers, completed swaps.
- **Retention:** D1, D7, D30 segmented by persona.

---

## 1) Experience Architecture (How Modules Fit Together)

### Unified Home = "Today in Your Garden"
Instead of separate disconnected tools, center the app around one dynamic dashboard:
- **Weather-aware task queue** (watering auto-adjusted for rain).
- **Garden health cards** (AI scan alerts, overdue tasks, pest trends).
- **Social pulse** (new comments, mentor replies, nearby swaps).
- **Micro-win CTA** ("Log one task to keep your streak").

This creates a single daily destination and avoids "feature sprawl" fatigue.

### Four Primary Tabs
1. **Today** (task engine + alerts + quick log)
2. **Grow** (plot planner, plant profiles, AI doctor, sunlight mapper)
3. **Community** (feed, Q&A, tours, swaps map)
4. **Profile** (virtual greenhouse, badges, stats, shop)

---

## 2) Persona-to-Feature Fit

### Urban Jungle Parent
- Fast camera-first interactions (AI doctor, quick journal).
- Window/balcony light recommendations.
- Small-space challenges ("7-Day Balcony Boost").

### Allotment Veteran
- Yield analytics, crop rotation history, swap credibility score.
- Deep plot planner + companion planting rules.
- Mentor tracks in Q&A (expert badges + leaderboards).

### Weekend Warrior
- "Don’t kill my plants" mode: simplified tasks, plain-language alerts.
- Friday planning + weekend batch checklist.
- Visual symptom guides offline.

---

## 3) Pillar-by-Pillar Product Design

## A. The Social Soil (Community)

### Garden Gram Feed
- Photo/video-first feed with structured metadata: plant, stage, task performed, location privacy level.
- Smart hashtags + seasonal auto-tags (#FirstFrost, #TomatoTuesday).
- Feed ranking blends social relevance + practical utility (prioritize posts with care outcomes, not just likes).

### Geo-Fenced Seed Swaps
- Map + list modes with travel radius and "pickup windows."
- Swap escrow flow: reserve -> handoff -> both confirm -> trust score update.
- Safety: pseudonymous pickup token, public meeting point suggestions, no exact home address by default.

### Ask a Sage (Q&A)
- Structured question template (plant type, symptom, climate zone, photo required for diagnosis categories).
- Reputation weighted by **accepted answers**, response quality, and follow-up outcomes.
- Escalation to verified experts for high-risk issues (toxic plants, severe infestations).

### Garden Tours
- Narrative mode: "Spring setup" -> "Mid-season" -> "Harvest finale."
- Guestbook comments + reaction stickers.
- Tour badges for educational value (pollination-friendly, water-saving, beginner-friendly).

## B. The Toolkit (Utility)

### AI Plant Doctor
- Pipeline: detect plant species -> classify symptom -> confidence score -> remedy ladder.
- Show confidence + "when to seek expert" threshold.
- Include local regulation-aware recommendations (e.g., pesticide legality by region).

### Smart Scheduler
- Rule engine using plant type, growth stage, pot size, local weather, and recent logs.
- Notifications have contextual alternatives: "Skip watering today (rain yesterday); rotate pot instead."
- Rescheduling uses behavior model (send at time user usually completes tasks).

### Sunlight Mapper
- AR scan creates a heat/light map of a spot over time.
- Suggest plants by light band (full sun / partial shade) + user skill level.
- Save scan snapshots across seasons.

### Plot Planner
- Drag-and-drop with spacing guides and conflict warnings.
- Companion planting and rotation suggestions.
- "What if" simulator for expected yield and disease pressure.

## C. Gamification (Sticky Loop)

### Virtual Greenhouse
- Digital twin evolves from user actions and outcomes.
- Plants in twin show "mood" based on real-world consistency.
- Milestone scenes unlock (pollinator visits, greenhouse expansion).

### Streaks & Badges
- Anti-burnout design: grace tokens, flexible streak definitions (e.g., 5/7 days).
- Badge categories: consistency, learning, helping, biodiversity.
- Seasonal quests prevent repetitive fatigue.

### Leaderboards
- Multiple lanes to avoid winner-take-all:
  - Most Harvested
  - Top Helper
  - Rare Plant Curator
  - Neighborhood Eco Impact
- Local/friends/global filters.

## D. Marketplace (Monetization)

### Shed Shop
- Trust primitives: verified photos, condition checklist, seller reliability score.
- Logistics: local pickup, bundled swaps, optional integrated shipping label in later phase.
- Featured collections tied to seasons ("Autumn Prep Essentials").

### Pro Tier
- Unlimited scans + advanced diagnosis history.
- Soil, yield, and effort analytics dashboards.
- Smart automations (irrigation integrations, advanced reminders).
- Optional family accounts for shared gardens.

---

## 4) Innovative Proposals

## Onboarding: Magical First 60 Seconds
- **Step 1 (10s):** choose identity archetype (Plant Parent / Veg Grower / Weekend Saver).
- **Step 2 (20s):** camera scan first plant -> instant "health card".
- **Step 3 (20s):** pick one goal ("Keep herbs alive" / "Grow salad in 30 days").
- **Step 4 (10s):** first quest unlocked + streak starts immediately.

Outcome: user gets value before full profile completion.

## AR Beyond Sunlight Mapping
- "See it grown": place mature plant/tree model in real space.
- AR spacing tape for bed layout.
- Pest hotspot overlays from previous scans.
- Seasonal preview mode (how plot may look in 8–12 weeks).

## Community Moderation at Scale
- Hybrid stack:
  - ML pre-screening for toxicity, spam, unsafe advice.
  - Community review circles (trusted users).
  - Reputation-gated publishing for sensitive advice categories.
  - Context cards under medical/safety answers with authoritative references.
- Strike + education model over pure punishment to preserve community health.

## Integrations
- Smart irrigation systems (Rachio/Gardena classes of APIs).
- Home weather stations (Netatmo, Ambient Weather).
- Calendar sync for task reminders.
- Health app-style achievements bridge (Apple/Google style engagement surfaces).

---

## 5) Technical Recommendation

## Platform
- **React Native + TypeScript** for velocity, mature ecosystem, and shared logic.
- Use native modules for heavy AR/ML paths where needed.

## Backend
- Modular services:
  - Auth/Profile
  - Feed/Community
  - Task & Scheduler Engine
  - AI Inference Gateway
  - Marketplace
- Event-driven architecture (task logged, diagnosis updated, swap completed) to power realtime experiences.

## Data & Storage
- Postgres for relational core (users, tasks, swaps, reputation).
- Object storage + CDN for high-resolution media.
- Search index (OpenSearch/Algolia class) for plants, posts, and marketplace listings.

## Offline-first
- Local-first store with conflict resolution rules.
- Offline-capable journal, task logging, saved guides, and queued uploads.
- Sync engine with deterministic merge strategy and user-visible conflict prompts where needed.

---

## 6) Monetization + Trust Strategy

- Freemium core utility; Pro for power users and advanced automation.
- Marketplace take-rate on completed sales.
- Future B2B: nursery partnerships, expert consultations, affiliate storefronts.
- Trust foundations (identity-lite verification, transaction scoring, content credibility labels) as a growth moat.

---

## 7) Roadmap (Phased Delivery)

## Phase 1 (0-4 months): Habit Loop MVP
- Today dashboard, smart scheduler, quick log, basic feed, Q&A, streaks.
- AI doctor v1 (top common houseplants + basic diseases).
- Offline journal and task queue.

## Phase 2 (4-8 months): Community Depth + Planning
- Seed swap map, garden tours, plot planner v1, richer leaderboards.
- Pro analytics beta.

## Phase 3 (8-12 months): AR + Marketplace Scale
- AR sunlight mapper + mature plant visualizer.
- Shed Shop with trust and transaction systems.
- Smart device integrations.

---

## 8) Risks & Mitigations

- **Bad AI advice risk:** confidence thresholds, expert escalation, clear disclaimers.
- **Cold-start community risk:** seed expert cohort + starter challenges + local clubs.
- **Notification fatigue:** adaptive cadence and user-controlled intensity.
- **Marketplace safety:** built-in identity and transaction safety rails.

---

## 9) One Better Idea to Challenge Assumptions

Instead of making gamification a separate layer, make **"Care Score"** the universal currency:
- Completing real tasks, helping others, and successful swaps all increase Care Score.
- Care Score unlocks profile prestige, marketplace trust boosts, and expert privileges.
- This aligns behavior across utility, community, and monetization while discouraging vanity-only engagement.
