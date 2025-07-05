[server](../README.md) / [Exports](../modules.md) / services/ai

# Module: services/ai

## Table of contents

### Type Aliases

- [AIServiceFactory](services_ai.md#aiservicefactory)

### Variables

- [aiServiceFactory](services_ai.md#aiservicefactory-1)

## Type Aliases

### AIServiceFactory

Ƭ **AIServiceFactory**: typeof [`aiServiceFactory`](services_ai.md#aiservicefactory-1)

#### Defined in

[server/src/services/ai/index.ts:170](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/index.ts#L170)

## Variables

### aiServiceFactory

• `Const` **aiServiceFactory**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getAIOrchestrator` | () => [`AIOrchestrator`](../classes/services_ai_AIOrchestrator.AIOrchestrator.md) |
| `getCacheService` | () => [`RedisCacheService`](../classes/services_common_RedisCacheService.RedisCacheService.md) |
| `getContentEnhancer` | () => [`ContentEnhancer`](../classes/services_ai_ContentEnhancer.ContentEnhancer.md) |
| `getContentValidator` | () => [`ContentValidator`](../classes/services_ai_ContentValidator.ContentValidator.md) |
| `getContextService` | (`logger`: [`ILogger`](../interfaces/types_ILogger.ILogger.md)) => [`ContextService`](../classes/services_ai_ContextService.ContextService.md) |
| `getPromptEngine` | () => [`PromptTemplateEngine`](../classes/services_ai_PromptTemplateEngine.PromptTemplateEngine.md) |

#### Defined in

[server/src/services/ai/index.ts:105](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/index.ts#L105)
