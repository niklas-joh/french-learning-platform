[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IContentGenerator

# Interface: IContentGenerator

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IContentGenerator

Main content generation interface - streamlined to focus on essential method
TODO: Reference Future Implementation #22 - Abstract Service Dependencies with Interfaces

## Implemented by

- [`DynamicContentGenerator`](../classes/services_contentGeneration_DynamicContentGenerator.DynamicContentGenerator.md)

## Table of contents

### Methods

- [generateContent](services_contentGeneration_interfaces.IContentGenerator.md#generatecontent)

## Methods

### generateContent

▸ **generateContent**(`request`): `Promise`\<\{ `jobId`: `string`  }\>

Enqueues a content generation request and returns a job ID.
The actual content generation is handled asynchronously.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`ContentRequest`](types_Content.ContentRequest.md) | The content generation request. |

#### Returns

`Promise`\<\{ `jobId`: `string`  }\>

A promise that resolves with the ID of the enqueued job.

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:28](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L28)
