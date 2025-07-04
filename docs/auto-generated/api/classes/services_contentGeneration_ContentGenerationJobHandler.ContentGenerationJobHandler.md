[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/ContentGenerationJobHandler](../modules/services_contentGeneration_ContentGenerationJobHandler.md) / ContentGenerationJobHandler

# Class: ContentGenerationJobHandler

[services/contentGeneration/ContentGenerationJobHandler](../modules/services_contentGeneration_ContentGenerationJobHandler.md).ContentGenerationJobHandler

Handles the processing of a single content generation job.
This class encapsulates the core logic of generating content,
moving it from the synchronous `DynamicContentGenerator` to a
job-based asynchronous workflow.

## Table of contents

### Constructors

- [constructor](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#constructor)

### Properties

- [aiOrchestrator](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#aiorchestrator)
- [contextService](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#contextservice)
- [enhancerFactory](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#enhancerfactory)
- [fallbackHandler](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#fallbackhandler)
- [logger](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#logger)
- [metricsService](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#metricsservice)
- [promptEngine](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#promptengine)
- [structurerFactory](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#structurerfactory)
- [templateManager](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#templatemanager)
- [validatorFactory](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#validatorfactory)
- [DEFAULT\_COMPLETION\_TIME](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#default_completion_time)

### Methods

- [createGeneratedContent](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#creategeneratedcontent)
- [estimateCompletionTime](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#estimatecompletiontime)
- [executeAIRequestWithTimeout](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#executeairequestwithtimeout)
- [extractLearningObjectives](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#extractlearningobjectives)
- [generateRawContent](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#generaterawcontent)
- [getAIConfigForType](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#getaiconfigfortype)
- [handleJob](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#handlejob)
- [structureContent](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md#structurecontent)

## Constructors

### constructor

• **new ContentGenerationJobHandler**(`aiOrchestrator`, `promptEngine`, `validatorFactory`, `enhancerFactory`, `templateManager`, `contextService`, `fallbackHandler`, `metricsService`, `structurerFactory`, `logger`): [`ContentGenerationJobHandler`](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `aiOrchestrator` | [`AIOrchestrator`](services_ai_AIOrchestrator.AIOrchestrator.md) |
| `promptEngine` | [`PromptTemplateEngine`](services_ai_PromptTemplateEngine.PromptTemplateEngine.md) |
| `validatorFactory` | [`IContentValidatorFactory`](../interfaces/services_contentGeneration_interfaces.IContentValidatorFactory.md) |
| `enhancerFactory` | [`IContentEnhancerFactory`](../interfaces/services_contentGeneration_interfaces.IContentEnhancerFactory.md) |
| `templateManager` | [`IContentTemplateManager`](../interfaces/services_contentGeneration_interfaces.IContentTemplateManager.md) |
| `contextService` | [`ILearningContextService`](../interfaces/services_contentGeneration_interfaces.ILearningContextService.md) |
| `fallbackHandler` | [`IContentFallbackHandler`](../interfaces/services_contentGeneration_interfaces.IContentFallbackHandler.md) |
| `metricsService` | [`IContentGenerationMetrics`](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md) |
| `structurerFactory` | [`ContentStructurerFactory`](services_contentGeneration_ContentStructurerFactory.ContentStructurerFactory.md) |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`ContentGenerationJobHandler`](services_contentGeneration_ContentGenerationJobHandler.ContentGenerationJobHandler.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:35](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L35)

## Properties

### aiOrchestrator

• `Private` **aiOrchestrator**: [`AIOrchestrator`](services_ai_AIOrchestrator.AIOrchestrator.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:36](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L36)

___

### contextService

• `Private` **contextService**: [`ILearningContextService`](../interfaces/services_contentGeneration_interfaces.ILearningContextService.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:41](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L41)

___

### enhancerFactory

• `Private` **enhancerFactory**: [`IContentEnhancerFactory`](../interfaces/services_contentGeneration_interfaces.IContentEnhancerFactory.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:39](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L39)

___

### fallbackHandler

• `Private` **fallbackHandler**: [`IContentFallbackHandler`](../interfaces/services_contentGeneration_interfaces.IContentFallbackHandler.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:42](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L42)

___

### logger

• `Private` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:45](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L45)

___

### metricsService

• `Private` **metricsService**: [`IContentGenerationMetrics`](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:43](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L43)

___

### promptEngine

• `Private` **promptEngine**: [`PromptTemplateEngine`](services_ai_PromptTemplateEngine.PromptTemplateEngine.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:37](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L37)

___

### structurerFactory

• `Private` **structurerFactory**: [`ContentStructurerFactory`](services_contentGeneration_ContentStructurerFactory.ContentStructurerFactory.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:44](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L44)

___

### templateManager

• `Private` **templateManager**: [`IContentTemplateManager`](../interfaces/services_contentGeneration_interfaces.IContentTemplateManager.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:40](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L40)

___

### validatorFactory

• `Private` **validatorFactory**: [`IContentValidatorFactory`](../interfaces/services_contentGeneration_interfaces.IContentValidatorFactory.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:38](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L38)

___

### DEFAULT\_COMPLETION\_TIME

▪ `Static` `Private` `Readonly` **DEFAULT\_COMPLETION\_TIME**: ``15``

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:33](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L33)

## Methods

### createGeneratedContent

▸ **createGeneratedContent**(`request`, `structuredContent`, `learningContext`, `validation`, `startTime`): [`GeneratedContent`](../interfaces/types_Content.GeneratedContent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |
| `structuredContent` | [`StructuredContent`](../modules/types_Content.md#structuredcontent) |
| `learningContext` | [`LearningContext`](../interfaces/types_Content.LearningContext.md) |
| `validation` | [`ContentValidation`](../interfaces/types_Content.ContentValidation.md) |
| `startTime` | `number` |

#### Returns

[`GeneratedContent`](../interfaces/types_Content.GeneratedContent.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:178](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L178)

___

### estimateCompletionTime

▸ **estimateCompletionTime**(`content`, `request`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](../modules/types_Content.md#structuredcontent) |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |

#### Returns

`number`

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:205](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L205)

___

### executeAIRequestWithTimeout

▸ **executeAIRequestWithTimeout**(`request`, `prompt`, `aiConfig`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |
| `prompt` | `string` |
| `aiConfig` | [`AIModelConfig`](../interfaces/config_aiContentConfig.AIModelConfig.md) |

#### Returns

`Promise`\<`any`\>

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:139](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L139)

___

### extractLearningObjectives

▸ **extractLearningObjectives**(`content`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](../modules/types_Content.md#structuredcontent) |

#### Returns

`string`[]

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:222](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L222)

___

### generateRawContent

▸ **generateRawContent**(`request`, `template`, `context`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |
| `template` | `any` |
| `context` | [`LearningContext`](../interfaces/types_Content.LearningContext.md) |

#### Returns

`Promise`\<`any`\>

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:108](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L108)

___

### getAIConfigForType

▸ **getAIConfigForType**(`type`): [`AIModelConfig`](../interfaces/config_aiContentConfig.AIModelConfig.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`ContentType`](../modules/types_Content.md#contenttype) |

#### Returns

[`AIModelConfig`](../interfaces/config_aiContentConfig.AIModelConfig.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:161](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L161)

___

### handleJob

▸ **handleJob**(`job`): `Promise`\<[`GeneratedContent`](../interfaces/types_Content.GeneratedContent.md)\>

Processes a single content generation job.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `job` | [`AiGenerationJobsModel`](models_AiGenerationJob.AiGenerationJobsModel.md) | The AI generation job to process. |

#### Returns

`Promise`\<[`GeneratedContent`](../interfaces/types_Content.GeneratedContent.md)\>

The generated content.

**`Throws`**

If a non-recoverable error occurs during generation.

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:54](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L54)

___

### structureContent

▸ **structureContent**(`rawContent`, `contentType`): `Promise`\<[`StructuredContent`](../modules/types_Content.md#structuredcontent)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawContent` | `string` |
| `contentType` | [`ContentType`](../modules/types_Content.md#contenttype) |

#### Returns

`Promise`\<[`StructuredContent`](../modules/types_Content.md#structuredcontent)\>

#### Defined in

[server/src/services/contentGeneration/ContentGenerationJobHandler.ts:165](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationJobHandler.ts#L165)
