# Garden Living Engineering Implementation Plan

## Build Order (recommended)
1. **Foundation**: Auth, profile, database migrations, media upload service.
2. **Habit Loop Core**: task scheduler, today API, task completion, streak updater.
3. **Community Core**: feed posting, comments/likes, question/answer + accept flow.
4. **Offline Reliability**: local queue + idempotent sync endpoints.
5. **Optimization**: caching, observability, trust/reputation tuning.

## Service Boundaries (MVP)
- `api-gateway`: auth, request fan-out, rate limiting.
- `task-service`: schedules, weather skip logic, completion events.
- `community-service`: posts, comments, Q&A, moderation hooks.
- `profile-service`: user profile, reputation, streak snapshots.
- `media-service`: pre-signed upload URLs, image metadata.

## First 6 Sprints (2 weeks each)

### Sprint 1
- Repo setup, CI, migration pipeline.
- Implement base tables and seed script.
- JWT auth + user profile endpoints.

### Sprint 2
- Task creation rules and today endpoint.
- Complete/skip task endpoint.
- Initial streak calculation worker.

### Sprint 3
- Weather ingestion job (hourly) + rainfall lookup.
- Watering skip recommendation endpoint.
- Notification payload contract.

### Sprint 4
- Feed post creation/read, like/comment.
- Basic hashtag parsing and indexing.

### Sprint 5
- Q&A ask/answer/accept.
- Reputation update transaction + audit log.

### Sprint 6
- Offline sync endpoint (idempotency key support).
- Conflict policy for duplicate task completions.
- Performance test + reliability hardening.

## Key Algorithms

### Watering Skip Logic (v1)
- Inputs: task type, plant location, postcode rainfall last 24h.
- Rule:
  - if `task_type != water` -> no skip suggestion
  - if location in (`yard`, `allotment`) and rainfall_mm >= 6.0 -> suggest skip
  - if location in (`indoor`, `balcony`) -> never auto-skip, only lower urgency

### Streak Logic (v1)
- Weekly streak preserved if user logs >= 5 meaningful actions in rolling 7 days.
- Meaningful actions: completed task, published post with image, accepted answer event.
- Grace token: one missed week allowed every 8 successful weeks.

## Observability & Metrics
- Track:
  - daily task completion rate
  - skip acceptance rate
  - D1/D7 retention
  - Q&A answer latency
  - sync success rate after offline period
- Required dashboards: product KPI, API latency, queue backlog, error budget.

## Risks and Mitigations
- **Weather false positives**: fallback to user override "I watered anyway".
- **Abuse in Q&A**: moderation queue + rate limits for new accounts.
- **Upload bottleneck**: direct-to-storage signed URL flow.
- **Offline duplication**: idempotency key on write operations.
