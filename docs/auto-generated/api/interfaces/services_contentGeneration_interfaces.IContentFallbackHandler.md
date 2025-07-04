[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IContentFallbackHandler

# Interface: IContentFallbackHandler

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IContentFallbackHandler

Interface for handling generation failures and fallbacks

## Implemented by

- [`ContentFallbackHandler`](../classes/services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md)

## Table of contents

### Methods

- [getFallbackContent](services_contentGeneration_interfaces.IContentFallbackHandler.md#getfallbackcontent)
- [shouldRetry](services_contentGeneration_interfaces.IContentFallbackHandler.md#shouldretry)

## Methods

### getFallbackContent

▸ **getFallbackContent**(`request`, `error`): `Promise`\<[`GeneratedContent`](types_Content.GeneratedContent.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](types_Content.ContentRequest.md) |
| `error` | `Error` |

#### Returns

`Promise`\<[`GeneratedContent`](types_Content.GeneratedContent.md)\>

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:137](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L137)

___

### shouldRetry

▸ **shouldRetry**(`error`, `retryCount`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `retryCount` | `number` |

#### Returns

`boolean`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:138](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L138)
