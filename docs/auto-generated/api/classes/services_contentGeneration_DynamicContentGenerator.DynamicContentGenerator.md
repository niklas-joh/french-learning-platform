[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/DynamicContentGenerator](../modules/services_contentGeneration_DynamicContentGenerator.md) / DynamicContentGenerator

# Class: DynamicContentGenerator

[services/contentGeneration/DynamicContentGenerator](../modules/services_contentGeneration_DynamicContentGenerator.md).DynamicContentGenerator

Main implementation of dynamic content generation.
This class is responsible for receiving content generation requests
and enqueuing them for asynchronous processing by a worker.

**`Implements`**

## Implements

- [`IContentGenerator`](../interfaces/services_contentGeneration_interfaces.IContentGenerator.md)

## Table of contents

### Constructors

- [constructor](services_contentGeneration_DynamicContentGenerator.DynamicContentGenerator.md#constructor)

### Properties

- [jobQueueService](services_contentGeneration_DynamicContentGenerator.DynamicContentGenerator.md#jobqueueservice)

### Methods

- [generateContent](services_contentGeneration_DynamicContentGenerator.DynamicContentGenerator.md#generatecontent)

## Constructors

### constructor

• **new DynamicContentGenerator**(`jobQueueService`): [`DynamicContentGenerator`](services_contentGeneration_DynamicContentGenerator.DynamicContentGenerator.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jobQueueService` | [`IJobQueueService`](../interfaces/services_contentGeneration_interfaces.IJobQueueService.md) | The service for enqueuing jobs. |

#### Returns

[`DynamicContentGenerator`](services_contentGeneration_DynamicContentGenerator.DynamicContentGenerator.md)

#### Defined in

[server/src/services/contentGeneration/DynamicContentGenerator.ts:17](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DynamicContentGenerator.ts#L17)

## Properties

### jobQueueService

• `Private` **jobQueueService**: [`IJobQueueService`](../interfaces/services_contentGeneration_interfaces.IJobQueueService.md)

The service for enqueuing jobs.

#### Defined in

[server/src/services/contentGeneration/DynamicContentGenerator.ts:17](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DynamicContentGenerator.ts#L17)

## Methods

### generateContent

▸ **generateContent**(`request`): `Promise`\<\{ `jobId`: `string`  }\>

Enqueues a content generation request and returns the job ID.
The actual content generation is handled asynchronously by a worker.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) | The content generation request. |

#### Returns

`Promise`\<\{ `jobId`: `string`  }\>

A promise that resolves with the ID of the enqueued job.

**`Throws`**

If the job cannot be enqueued.

#### Implementation of

[IContentGenerator](../interfaces/services_contentGeneration_interfaces.IContentGenerator.md).[generateContent](../interfaces/services_contentGeneration_interfaces.IContentGenerator.md#generatecontent)

#### Defined in

[server/src/services/contentGeneration/DynamicContentGenerator.ts:27](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DynamicContentGenerator.ts#L27)
