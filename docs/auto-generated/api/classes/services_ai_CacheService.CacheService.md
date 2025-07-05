[server](../README.md) / [Exports](../modules.md) / [services/ai/CacheService](../modules/services_ai_CacheService.md) / CacheService

# Class: CacheService

[services/ai/CacheService](../modules/services_ai_CacheService.md).CacheService

CacheService

**`Description`**

Provides a robust, type-safe caching layer for AI responses using Redis.
             Implements semantic caching with deterministic key generation to maximize
             cache hit rates while maintaining full type safety.

## Table of contents

### Constructors

- [constructor](services_ai_CacheService.CacheService.md#constructor)

### Properties

- [config](services_ai_CacheService.CacheService.md#config)
- [logger](services_ai_CacheService.CacheService.md#logger)
- [redis](services_ai_CacheService.CacheService.md#redis)

### Methods

- [clear](services_ai_CacheService.CacheService.md#clear)
- [generateCacheKey](services_ai_CacheService.CacheService.md#generatecachekey)
- [get](services_ai_CacheService.CacheService.md#get)
- [getStats](services_ai_CacheService.CacheService.md#getstats)
- [set](services_ai_CacheService.CacheService.md#set)
- [sortObjectKeys](services_ai_CacheService.CacheService.md#sortobjectkeys)

## Constructors

### constructor

• **new CacheService**(`redis`, `config`, `logger?`): [`CacheService`](services_ai_CacheService.CacheService.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `redis` | `Redis` | `undefined` | Configured Redis client instance |
| `config` | [`CacheStrategyConfig`](../interfaces/types_AI.CacheStrategyConfig.md) | `undefined` | Cache strategy configuration |
| `logger` | `ILogger` | `console` | Logger instance (defaults to console for now) |

#### Returns

[`CacheService`](services_ai_CacheService.CacheService.md)

#### Defined in

[server/src/services/ai/CacheService.ts:53](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L53)

## Properties

### config

• `Private` **config**: [`CacheStrategyConfig`](../interfaces/types_AI.CacheStrategyConfig.md)

#### Defined in

[server/src/services/ai/CacheService.ts:44](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L44)

___

### logger

• `Private` **logger**: `ILogger`

#### Defined in

[server/src/services/ai/CacheService.ts:45](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L45)

___

### redis

• `Private` **redis**: `Redis`

#### Defined in

[server/src/services/ai/CacheService.ts:43](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L43)

## Methods

### clear

▸ **clear**(`pattern?`): `Promise`\<`void`\>

Clears all cached AI responses (useful for testing or cache invalidation).

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pattern` | `string` | `'ai-cache:*'` | Redis key pattern to match (defaults to all AI cache keys) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/ai/CacheService.ts:181](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L181)

___

### generateCacheKey

▸ **generateCacheKey**\<`T`\>(`taskType`, `payload`): `string`

Generates a deterministic, collision-resistant cache key from task type and payload.

Key improvements:
- Sorts object keys to ensure consistent JSON string representation
- Uses SHA256 for collision-resistant, fixed-length keys
- Includes task type in key for namespace separation

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskType` | `T` | The AI task type for namespace separation |
| `payload` | [`AITaskRequestPayload`](../modules/types_AI.md#aitaskrequestpayload)\<`T`\> | The request payload to hash |

#### Returns

`string`

A deterministic SHA256-based cache key

#### Defined in

[server/src/services/ai/CacheService.ts:73](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L73)

___

### get

▸ **get**\<`T`\>(`taskType`, `payload`): `Promise`\<``null`` \| [`AIResponse`](../interfaces/types_AI.AIResponse.md)\<`T`\>\>

Retrieves a cached AI response if available.

Implements "fail open" pattern - if Redis fails, returns null rather than
throwing an error, allowing the AI request to proceed without caching.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskType` | `T` | The AI task type |
| `payload` | [`AITaskRequestPayload`](../modules/types_AI.md#aitaskrequestpayload)\<`T`\> | The request payload to look up |

#### Returns

`Promise`\<``null`` \| [`AIResponse`](../interfaces/types_AI.AIResponse.md)\<`T`\>\>

Cached response or null if not found/error occurred

#### Defined in

[server/src/services/ai/CacheService.ts:119](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L119)

___

### getStats

▸ **getStats**(): `Promise`\<\{ `memoryUsage?`: `string` ; `totalKeys`: `number`  }\>

Gets cache statistics for monitoring and optimization.

#### Returns

`Promise`\<\{ `memoryUsage?`: `string` ; `totalKeys`: `number`  }\>

Basic cache statistics

#### Defined in

[server/src/services/ai/CacheService.ts:199](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L199)

___

### set

▸ **set**\<`T`\>(`taskType`, `payload`, `response`): `Promise`\<`void`\>

Caches an AI response with the configured TTL.

Implements "fail open" pattern - if Redis fails, logs the error but doesn't
throw, allowing the main AI request flow to continue successfully.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskType` | `T` | The AI task type |
| `payload` | [`AITaskRequestPayload`](../modules/types_AI.md#aitaskrequestpayload)\<`T`\> | The request payload used for key generation |
| `response` | [`AIResponse`](../interfaces/types_AI.AIResponse.md)\<`T`\> | The AI response to cache |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/ai/CacheService.ts:155](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L155)

___

### sortObjectKeys

▸ **sortObjectKeys**(`obj`): `any`

Recursively sorts object keys to ensure deterministic JSON serialization.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `any` | Object to sort |

#### Returns

`any`

Object with sorted keys at all levels

#### Defined in

[server/src/services/ai/CacheService.ts:96](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/CacheService.ts#L96)
