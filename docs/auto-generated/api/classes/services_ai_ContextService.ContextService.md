[server](../README.md) / [Exports](../modules.md) / [services/ai/ContextService](../modules/services_ai_ContextService.md) / ContextService

# Class: ContextService

[services/ai/ContextService](../modules/services_ai_ContextService.md).ContextService

ContextService

**`Implements`**

**`Description`**

Manages user context data for AI personalization.

## Implements

- [`ILearningContextService`](../interfaces/services_contentGeneration_interfaces.ILearningContextService.md)

## Table of contents

### Constructors

- [constructor](services_ai_ContextService.ContextService.md#constructor)

### Properties

- [cache](services_ai_ContextService.ContextService.md#cache)
- [logger](services_ai_ContextService.ContextService.md#logger)

### Methods

- [fetchAndBuildContext](services_ai_ContextService.ContextService.md#fetchandbuildcontext)
- [getAIUserContext](services_ai_ContextService.ContextService.md#getaiusercontext)
- [getRecentTopics](services_ai_ContextService.ContextService.md#getrecenttopics)
- [getUserContext](services_ai_ContextService.ContextService.md#getusercontext)
- [getWeakAreas](services_ai_ContextService.ContextService.md#getweakareas)
- [updateContext](services_ai_ContextService.ContextService.md#updatecontext)

## Constructors

### constructor

• **new ContextService**(`cacheService`, `logger?`): [`ContextService`](services_ai_ContextService.ContextService.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cacheService` | [`ICacheService`](../interfaces/services_common_ICacheService.ICacheService.md) | `undefined` |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) | `console` |

#### Returns

[`ContextService`](services_ai_ContextService.ContextService.md)

#### Defined in

[server/src/services/ai/ContextService.ts:29](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContextService.ts#L29)

## Properties

### cache

• `Private` **cache**: [`ICacheService`](../interfaces/services_common_ICacheService.ICacheService.md)

#### Defined in

[server/src/services/ai/ContextService.ts:26](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContextService.ts#L26)

___

### logger

• `Private` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Defined in

[server/src/services/ai/ContextService.ts:27](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContextService.ts#L27)

## Methods

### fetchAndBuildContext

▸ **fetchAndBuildContext**(`userId`): `Promise`\<[`LearningContext`](../interfaces/types_Content.LearningContext.md)\>

Fetches all required data from the database and builds the LearningContext object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `number` | The ID of the user. |

#### Returns

`Promise`\<[`LearningContext`](../interfaces/types_Content.LearningContext.md)\>

The fully constructed learning context.

#### Defined in

[server/src/services/ai/ContextService.ts:95](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContextService.ts#L95)

___

### getAIUserContext

▸ **getAIUserContext**(`userId`): `Promise`\<[`AIUserContext`](../modules/types_AI.md#aiusercontext)\>

Retrieves the lean AI-specific user context.
This is a convenience method for services that only need the AIUserContext.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `number` | The ID of the user. |

#### Returns

`Promise`\<[`AIUserContext`](../modules/types_AI.md#aiusercontext)\>

The user's lean AI context.

#### Defined in

[server/src/services/ai/ContextService.ts:74](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContextService.ts#L74)

___

### getRecentTopics

▸ **getRecentTopics**(`userId`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[server/src/services/ai/ContextService.ts:129](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContextService.ts#L129)

___

### getUserContext

▸ **getUserContext**(`userId`): `Promise`\<[`LearningContext`](../interfaces/types_Content.LearningContext.md)\>

Retrieves the full learning context for a user, using a cache-through strategy.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `number` | The ID of the user. |

#### Returns

`Promise`\<[`LearningContext`](../interfaces/types_Content.LearningContext.md)\>

The user's learning context.

#### Implementation of

[ILearningContextService](../interfaces/services_contentGeneration_interfaces.ILearningContextService.md).[getUserContext](../interfaces/services_contentGeneration_interfaces.ILearningContextService.md#getusercontext)

#### Defined in

[server/src/services/ai/ContextService.ts:40](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContextService.ts#L40)

___

### getWeakAreas

▸ **getWeakAreas**(`userId`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[server/src/services/ai/ContextService.ts:135](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContextService.ts#L135)

___

### updateContext

▸ **updateContext**(`userId`, `updates`): `Promise`\<`void`\>

Updates parts of a user's context and invalidates the cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `number` | The ID of the user to update. |
| `updates` | `Partial`\<[`LearningContext`](../interfaces/types_Content.LearningContext.md)\> | The partial context data to update (not yet implemented). |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ILearningContextService](../interfaces/services_contentGeneration_interfaces.ILearningContextService.md).[updateContext](../interfaces/services_contentGeneration_interfaces.ILearningContextService.md#updatecontext)

#### Defined in

[server/src/services/ai/ContextService.ts:61](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContextService.ts#L61)
