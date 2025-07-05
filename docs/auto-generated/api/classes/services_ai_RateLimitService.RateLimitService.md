[server](../README.md) / [Exports](../modules.md) / [services/ai/RateLimitService](../modules/services_ai_RateLimitService.md) / RateLimitService

# Class: RateLimitService

[services/ai/RateLimitService](../modules/services_ai_RateLimitService.md).RateLimitService

RateLimitService

**`Description`**

Manages AI request rate limits using an efficient fixed-window counter algorithm.
             Provides cost control and prevents API abuse while maintaining excellent performance.

## Table of contents

### Constructors

- [constructor](services_ai_RateLimitService.RateLimitService.md#constructor)

### Properties

- [config](services_ai_RateLimitService.RateLimitService.md#config)
- [logger](services_ai_RateLimitService.RateLimitService.md#logger)
- [redis](services_ai_RateLimitService.RateLimitService.md#redis)

### Methods

- [cleanup](services_ai_RateLimitService.RateLimitService.md#cleanup)
- [getGlobalStats](services_ai_RateLimitService.RateLimitService.md#getglobalstats)
- [getStatus](services_ai_RateLimitService.RateLimitService.md#getstatus)
- [isAllowed](services_ai_RateLimitService.RateLimitService.md#isallowed)
- [resetUserLimit](services_ai_RateLimitService.RateLimitService.md#resetuserlimit)

## Constructors

### constructor

• **new RateLimitService**(`redis`, `config`, `logger?`): [`RateLimitService`](services_ai_RateLimitService.RateLimitService.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `redis` | `Redis` | `undefined` | Configured Redis client instance |
| `config` | [`RateLimitStrategyConfig`](../interfaces/types_AI.RateLimitStrategyConfig.md) | `undefined` | Rate limiting strategy configuration |
| `logger` | `ILogger` | `console` | Logger instance (defaults to console for now) |

#### Returns

[`RateLimitService`](services_ai_RateLimitService.RateLimitService.md)

#### Defined in

[server/src/services/ai/RateLimitService.ts:45](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/RateLimitService.ts#L45)

## Properties

### config

• `Private` **config**: [`RateLimitStrategyConfig`](../interfaces/types_AI.RateLimitStrategyConfig.md)

#### Defined in

[server/src/services/ai/RateLimitService.ts:36](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/RateLimitService.ts#L36)

___

### logger

• `Private` **logger**: `ILogger`

#### Defined in

[server/src/services/ai/RateLimitService.ts:37](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/RateLimitService.ts#L37)

___

### redis

• `Private` **redis**: `Redis`

#### Defined in

[server/src/services/ai/RateLimitService.ts:35](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/RateLimitService.ts#L35)

## Methods

### cleanup

▸ **cleanup**(): `Promise`\<`void`\>

Cleans up expired rate limit keys (maintenance function).
Redis should handle this automatically with EXPIRE, but this provides
a manual cleanup option if needed.

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/ai/RateLimitService.ts:208](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/RateLimitService.ts#L208)

___

### getGlobalStats

▸ **getGlobalStats**(): `Promise`\<\{ `totalActiveKeys`: `number` ; `totalActiveUsers`: `number`  }\>

Gets global rate limiting statistics for monitoring and optimization.

#### Returns

`Promise`\<\{ `totalActiveKeys`: `number` ; `totalActiveUsers`: `number`  }\>

Promise with aggregated rate limiting statistics

#### Defined in

[server/src/services/ai/RateLimitService.ts:173](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/RateLimitService.ts#L173)

___

### getStatus

▸ **getStatus**(`userId`): `Promise`\<\{ `currentRequests`: `number` ; `maxRequests`: `number` ; `remainingRequests`: `number` ; `windowMinutes`: `number`  }\>

Gets current rate limit status for a user without incrementing the counter.
Useful for displaying remaining requests to users or for monitoring.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | The ID of the user to check |

#### Returns

`Promise`\<\{ `currentRequests`: `number` ; `maxRequests`: `number` ; `remainingRequests`: `number` ; `windowMinutes`: `number`  }\>

Promise with current usage and remaining requests

#### Defined in

[server/src/services/ai/RateLimitService.ts:109](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/RateLimitService.ts#L109)

___

### isAllowed

▸ **isAllowed**(`userId`): `Promise`\<`boolean`\>

Checks if a request from a user is allowed based on configured rate limits.

Uses an efficient fixed-window counter algorithm:
1. INCR the counter for the user's current time window
2. If this is the first request (count = 1), set expiry on the key
3. Check if count exceeds the configured maximum

This approach is much more efficient than sliding windows and provides
adequate rate limiting for cost control purposes.

Implements "fail open" pattern - if Redis fails, allows the request to proceed
rather than blocking legitimate users due to infrastructure issues.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | The ID of the user making the request |

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> - true if request is allowed, false if rate limited

#### Defined in

[server/src/services/ai/RateLimitService.ts:69](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/RateLimitService.ts#L69)

___

### resetUserLimit

▸ **resetUserLimit**(`userId`): `Promise`\<`void`\>

Resets rate limit for a specific user (admin function).
Useful for customer support or testing scenarios.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | The ID of the user whose rate limit should be reset |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/ai/RateLimitService.ts:156](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/RateLimitService.ts#L156)
