[server](../README.md) / [Exports](../modules.md) / [services/ai/AIOrchestrator](../modules/services_ai_AIOrchestrator.md) / AIOrchestrator

# Class: AIOrchestrator

[services/ai/AIOrchestrator](../modules/services_ai_AIOrchestrator.md).AIOrchestrator

AIOrchestrator

**`Description`**

Central service for coordinating all AI operations.

## Table of contents

### Constructors

- [constructor](services_ai_AIOrchestrator.AIOrchestrator.md#constructor)

### Properties

- [cacheService](services_ai_AIOrchestrator.AIOrchestrator.md#cacheservice)
- [config](services_ai_AIOrchestrator.AIOrchestrator.md#config)
- [contentEnhancer](services_ai_AIOrchestrator.AIOrchestrator.md#contentenhancer)
- [contentValidator](services_ai_AIOrchestrator.AIOrchestrator.md#contentvalidator)
- [contextService](services_ai_AIOrchestrator.AIOrchestrator.md#contextservice)
- [fallbackHandler](services_ai_AIOrchestrator.AIOrchestrator.md#fallbackhandler)
- [logger](services_ai_AIOrchestrator.AIOrchestrator.md#logger)
- [metricsService](services_ai_AIOrchestrator.AIOrchestrator.md#metricsservice)
- [promptEngine](services_ai_AIOrchestrator.AIOrchestrator.md#promptengine)
- [rateLimitService](services_ai_AIOrchestrator.AIOrchestrator.md#ratelimitservice)

### Methods

- [assessPronunciation](services_ai_AIOrchestrator.AIOrchestrator.md#assesspronunciation)
- [executeStubbedAIProvider](services_ai_AIOrchestrator.AIOrchestrator.md#executestubbedaiprovider)
- [generateCacheKey](services_ai_AIOrchestrator.AIOrchestrator.md#generatecachekey)
- [generateContent](services_ai_AIOrchestrator.AIOrchestrator.md#generatecontent)
- [generateLesson](services_ai_AIOrchestrator.AIOrchestrator.md#generatelesson)
- [generateStubbedContent](services_ai_AIOrchestrator.AIOrchestrator.md#generatestubbedcontent)
- [gradeResponse](services_ai_AIOrchestrator.AIOrchestrator.md#graderesponse)
- [hashString](services_ai_AIOrchestrator.AIOrchestrator.md#hashstring)
- [processAIRequest](services_ai_AIOrchestrator.AIOrchestrator.md#processairequest)

## Constructors

### constructor

• **new AIOrchestrator**(`config`, `cacheService`, `rateLimitService`, `fallbackHandler`, `contextService`, `metricsService`, `promptEngine`, `contentValidator`, `contentEnhancer`, `logger?`): [`AIOrchestrator`](services_ai_AIOrchestrator.AIOrchestrator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`OrchestrationConfig`](../interfaces/types_AI.OrchestrationConfig.md) |
| `cacheService` | [`ICacheService`](../interfaces/services_common_ICacheService.ICacheService.md) |
| `rateLimitService` | [`RateLimitService`](services_ai_RateLimitService.RateLimitService.md) |
| `fallbackHandler` | [`FallbackHandler`](services_ai_FallbackHandler.FallbackHandler.md) |
| `contextService` | [`ContextService`](services_ai_ContextService.ContextService.md) |
| `metricsService` | [`AIMetricsService`](services_ai_AIMetricsService.AIMetricsService.md) |
| `promptEngine` | [`PromptTemplateEngine`](services_ai_PromptTemplateEngine.PromptTemplateEngine.md) |
| `contentValidator` | [`ContentValidator`](services_ai_ContentValidator.ContentValidator.md) |
| `contentEnhancer` | [`ContentEnhancer`](services_ai_ContentEnhancer.ContentEnhancer.md) |
| `logger?` | [`ILogger`](../interfaces/utils_logger.ILogger.md) |

#### Returns

[`AIOrchestrator`](services_ai_AIOrchestrator.AIOrchestrator.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:25](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L25)

## Properties

### cacheService

• `Private` `Readonly` **cacheService**: [`ICacheService`](../interfaces/services_common_ICacheService.ICacheService.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:27](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L27)

___

### config

• `Private` `Readonly` **config**: [`OrchestrationConfig`](../interfaces/types_AI.OrchestrationConfig.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:26](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L26)

___

### contentEnhancer

• `Private` `Readonly` **contentEnhancer**: [`ContentEnhancer`](services_ai_ContentEnhancer.ContentEnhancer.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:34](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L34)

___

### contentValidator

• `Private` `Readonly` **contentValidator**: [`ContentValidator`](services_ai_ContentValidator.ContentValidator.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:33](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L33)

___

### contextService

• `Private` `Readonly` **contextService**: [`ContextService`](services_ai_ContextService.ContextService.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:30](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L30)

___

### fallbackHandler

• `Private` `Readonly` **fallbackHandler**: [`FallbackHandler`](services_ai_FallbackHandler.FallbackHandler.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:29](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L29)

___

### logger

• `Private` `Readonly` **logger**: [`ILogger`](../interfaces/utils_logger.ILogger.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:23](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L23)

___

### metricsService

• `Private` `Readonly` **metricsService**: [`AIMetricsService`](services_ai_AIMetricsService.AIMetricsService.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:31](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L31)

___

### promptEngine

• `Private` `Readonly` **promptEngine**: [`PromptTemplateEngine`](services_ai_PromptTemplateEngine.PromptTemplateEngine.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:32](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L32)

___

### rateLimitService

• `Private` `Readonly` **rateLimitService**: [`RateLimitService`](services_ai_RateLimitService.RateLimitService.md)

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:28](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L28)

## Methods

### assessPronunciation

▸ **assessPronunciation**(`context`, `payload`): `Promise`\<[`AIResponse`](../interfaces/types_AI.AIResponse.md)\<``"ASSESS_PRONUNCIATION"``\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`AIUserContext`](../modules/types_AI.md#aiusercontext) | User context for personalization |
| `payload` | `Object` | Audio URL and expected phrase for assessment |
| `payload.audioUrl` | `string` | URL to the audio recording |
| `payload.expectedPhrase` | `string` | The phrase that should have been pronounced |

#### Returns

`Promise`\<[`AIResponse`](../interfaces/types_AI.AIResponse.md)\<``"ASSESS_PRONUNCIATION"``\>\>

Promise resolving to pronunciation assessment with score and feedback

**`Description`**

Assess pronunciation quality from audio recording

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:166](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L166)

___

### executeStubbedAIProvider

▸ **executeStubbedAIProvider**\<`T`\>(`taskType`, `payload`): [`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md)[`T`][``"response"``]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `taskType` | `T` |
| `payload` | [`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md)[`T`][``"request"``] |

#### Returns

[`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md)[`T`][``"response"``]

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:105](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L105)

___

### generateCacheKey

▸ **generateCacheKey**\<`T`\>(`task`, `payload`): `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `task` | `T` |
| `payload` | `any` |

#### Returns

`string`

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:347](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L347)

___

### generateContent

▸ **generateContent**(`userId`, `contentType`, `options`): `Promise`\<\{ `data?`: `any` ; `error?`: `string` ; `success`: `boolean` ; `tokenUsage?`: `any`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `contentType` | `string` |
| `options` | `Object` |
| `options.maxTokens` | `number` |
| `options.model` | `string` |
| `options.prompt` | `string` |
| `options.temperature` | `number` |

#### Returns

`Promise`\<\{ `data?`: `any` ; `error?`: `string` ; `success`: `boolean` ; `tokenUsage?`: `any`  }\>

**`Description`**

Generate content using AI for dynamic content generation
Added for Task 3.1.B.3.a - Raw Content Generation

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:200](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L200)

___

### generateLesson

▸ **generateLesson**(`context`, `payload`): `Promise`\<[`AIResponse`](../interfaces/types_AI.AIResponse.md)\<``"GENERATE_LESSON"``\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`AIUserContext`](../modules/types_AI.md#aiusercontext) | - |
| `payload` | `Object` | - |
| `payload.difficulty` | ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` | Difficulty level for the lesson |
| `payload.estimatedTime?` | `number` | Estimated duration in minutes |
| `payload.topic` | `string` | The topic for lesson generation |

#### Returns

`Promise`\<[`AIResponse`](../interfaces/types_AI.AIResponse.md)\<``"GENERATE_LESSON"``\>\>

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:148](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L148)

___

### generateStubbedContent

▸ **generateStubbedContent**(`contentType`, `options`): `any`

Generate stubbed content for different content types
TODO: Replace with actual AI provider integration

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | `string` |
| `options` | `any` |

#### Returns

`any`

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:288](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L288)

___

### gradeResponse

▸ **gradeResponse**(`context`, `payload`): `Promise`\<[`AIResponse`](../interfaces/types_AI.AIResponse.md)\<``"GRADE_RESPONSE"``\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`AIUserContext`](../modules/types_AI.md#aiusercontext) | User context for personalization |
| `payload` | `Object` | User response, correct answer, and question type for grading |
| `payload.correctAnswer` | `string` | The correct or expected answer |
| `payload.questionType` | ``"multiple_choice"`` \| ``"fill_blank"`` \| ``"translation"`` \| ``"essay"`` | Type of question being graded |
| `payload.userResponse` | `string` | The user's response to grade |

#### Returns

`Promise`\<[`AIResponse`](../interfaces/types_AI.AIResponse.md)\<``"GRADE_RESPONSE"``\>\>

Promise resolving to grading result with score, feedback, and suggestions

**`Description`**

Grade user response against correct answer

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:184](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L184)

___

### hashString

▸ **hashString**(`str`): `string`

Simple hash function for cache keys

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:337](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L337)

___

### processAIRequest

▸ **processAIRequest**\<`T`\>(`request`): `Promise`\<[`AIResponse`](../interfaces/types_AI.AIResponse.md)\<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`AIRequest`](../interfaces/types_AI.AIRequest.md)\<`T`\> |

#### Returns

`Promise`\<[`AIResponse`](../interfaces/types_AI.AIResponse.md)\<`T`\>\>

#### Defined in

[server/src/services/ai/AIOrchestrator.ts:41](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/AIOrchestrator.ts#L41)
