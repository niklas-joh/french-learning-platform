# AI Content Workflow Mismatches

This document records the known issues identified in the AI content generation workflow.

1. **Unsupported content type** – Client allowed `conversation_practice` but server validation only accepted `lesson`, `vocabulary_drill`, or `grammar_exercise`.
2. **Grammar requests missing required field** – Server required a `grammarFocus` field for `grammar_exercise` requests, but the client never supplied it.
3. **Job status terminology mismatch** – Server used `queued` while the client expected `pending`, leading to dropped jobs during cleanup.
4. **Result retrieval mismatch** – The server returned completed results in a `data` field, but the client looked for `result`.
5. **Cancellation status inconsistency** – Client marked cancelled jobs as `failed`, while the server marked them `cancelled`.
6. **Job listing parameters out of sync** – Server expected `page`/`pageSize`, but the client sent `limit`/`offset`.
7. **Unused batch generation API** – Client exposed a `generateBatchContent` method, but no server route existed for it.
8. **Redundant or unused pieces** – `taskHandlerMap` in the controller was unused, and routes like `/curriculum/daily-plan/:userId` ignored the path parameter.

Issues 1–6 and 8 have been addressed in the codebase.
