feat(ai): Initial setup for AI Orchestration Service

This commit establishes the foundational setup for the AI Orchestration Service, as outlined in Task 3.1.A.1 of the Phase 3 AI Integration plan.

Key changes include:
- Added `openai`, `ioredis`, and `object-hash` as dependencies to `server/package.json`.
- Updated `server/.env.example` and `server/.env` with new environment variables for AI services, including API keys, Redis URL, and cost management settings.
- Created a centralized, type-safe configuration file at `server/src/config/aiConfig.ts` to manage all AI-related settings.

This initial setup is critical for all subsequent AI development, providing a robust and scalable foundation for the new features.
