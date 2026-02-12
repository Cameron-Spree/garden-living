# Garden Living MVP Specification (Phase 1 Build-Ready)

## Goal
Ship a production-ready **Habit Loop MVP** that drives daily usage through:
1. a weather-aware task dashboard,
2. quick task logging,
3. social posting,
4. Q&A help,
5. streak feedback.

## Scope (In)
- Auth + profile setup (lightweight)
- "Today" dashboard with daily tasks
- Smart Scheduler v1 (weather-aware watering skip)
- Quick Log (water, prune, feed, inspect)
- Garden Gram feed (post photo + caption + tags)
- Ask a Sage Q&A (ask/answer/accept answer)
- Streak tracking (5/7 model)
- Offline local queue for task logs + draft posts

## Scope (Out)
- Marketplace transactions
- AR sunlight mapping
- Plot planner drag-and-drop
- Full AI doctor diagnosis (placeholder hook only)

---

## User Stories (Must Have)

### Onboarding
- As a new user, I can create an account and select one gardening goal so I receive relevant starter tasks.
- As a new user, I can add at least one plant profile (name/type/location).

### Today Dashboard
- As a user, I can view tasks due today grouped by urgency.
- As a user, I can complete a task in one tap from the dashboard.
- As a user, I receive a watering skip suggestion if recent rainfall exceeds threshold.

### Feed
- As a user, I can create a post with photo, caption, and tags.
- As a user, I can like and comment on a post.

### Q&A
- As a user, I can ask a question with category + photo optional.
- As a user, I can answer others' questions.
- As question owner, I can accept one answer.

### Streaks
- As a user, I can see my current streak and how many actions remain this week to maintain it.

### Offline
- As a user with poor signal, I can log tasks offline and sync when connected.

---

## Non-Functional Requirements
- P95 API latency < 350ms for non-media endpoints.
- Feed first render < 2.5s on median mobile network.
- Handle 5MB image uploads with resumable strategy.
- Offline queue survives app restarts.
- Audit trail for accepted answers and task completions.

---

## Domain Model (MVP)
- User
- Garden
- Plant
- Task
- TaskCompletion
- Post
- Comment
- Question
- Answer
- StreakSnapshot
- WeatherObservation

---

## Event Model
- `task.created`
- `task.completed`
- `post.published`
- `question.asked`
- `answer.accepted`
- `streak.updated`

Events feed leaderboard/streak/materialized views asynchronously.

---

## Acceptance Criteria (Release Gate)
1. New users can complete onboarding and finish first task in < 90 seconds median.
2. At least 95% of offline-logged tasks sync correctly within 60s of reconnect.
3. Watering skip logic uses location weather observations from last 24 hours.
4. Accepted answer updates reputation and is reflected in user profile.
5. Streak card updates instantly on task completion.
