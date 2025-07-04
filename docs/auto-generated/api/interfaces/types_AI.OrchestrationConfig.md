[server](../README.md) / [Exports](../modules.md) / [types/AI](../modules/types_AI.md) / OrchestrationConfig

# Interface: OrchestrationConfig

[types/AI](../modules/types_AI.md).OrchestrationConfig

**`Description`**

Master configuration for the AI Orchestrator with full type safety.
             Replaces generic configuration objects with specific, type-safe interfaces.

## Table of contents

### Properties

- [defaultProvider](types_AI.OrchestrationConfig.md#defaultprovider)
- [providers](types_AI.OrchestrationConfig.md#providers)
- [redisUrl](types_AI.OrchestrationConfig.md#redisurl)
- [strategies](types_AI.OrchestrationConfig.md#strategies)

## Properties

### defaultProvider

• **defaultProvider**: ``"OpenAI"`` \| ``"Azure"`` \| ``"Gemini"``

Default AI provider to use

#### Defined in

[server/src/types/AI.ts:99](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L99)

___

### providers

• **providers**: `Object`

Provider-specific configuration

#### Type declaration

| Name | Type |
| :------ | :------ |
| `openAI` | \{ `apiKey`: `string` ; `defaultModel`: `string`  } |
| `openAI.apiKey` | `string` |
| `openAI.defaultModel` | `string` |

#### Defined in

[server/src/types/AI.ts:103](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L103)

___

### redisUrl

• **redisUrl**: `string`

Redis connection URL for caching and session management

#### Defined in

[server/src/types/AI.ts:101](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L101)

___

### strategies

• **strategies**: `Object`

Strategy configurations with type safety

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caching` | [`CacheStrategyConfig`](types_AI.CacheStrategyConfig.md) |
| `fallback` | [`FallbackStrategyConfig`](types_AI.FallbackStrategyConfig.md) |
| `rateLimiting` | [`RateLimitStrategyConfig`](types_AI.RateLimitStrategyConfig.md) |

#### Defined in

[server/src/types/AI.ts:113](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L113)
