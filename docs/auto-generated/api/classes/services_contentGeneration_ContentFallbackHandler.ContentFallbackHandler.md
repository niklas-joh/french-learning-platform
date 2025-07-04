[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/ContentFallbackHandler](../modules/services_contentGeneration_ContentFallbackHandler.md) / ContentFallbackHandler

# Class: ContentFallbackHandler

[services/contentGeneration/ContentFallbackHandler](../modules/services_contentGeneration_ContentFallbackHandler.md).ContentFallbackHandler

Interface for handling generation failures and fallbacks

## Implements

- [`IContentFallbackHandler`](../interfaces/services_contentGeneration_interfaces.IContentFallbackHandler.md)

## Table of contents

### Constructors

- [constructor](services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md#constructor)

### Properties

- [fallbackCache](services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md#fallbackcache)
- [fallbackDir](services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md#fallbackdir)
- [logger](services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md#logger)

### Methods

- [getFallbackContent](services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md#getfallbackcontent)
- [loadFallbackContent](services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md#loadfallbackcontent)
- [shouldRetry](services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md#shouldretry)

## Constructors

### constructor

• **new ContentFallbackHandler**(`logger`): [`ContentFallbackHandler`](services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`ContentFallbackHandler`](services_contentGeneration_ContentFallbackHandler.ContentFallbackHandler.md)

#### Defined in

[server/src/services/contentGeneration/ContentFallbackHandler.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentFallbackHandler.ts#L12)

## Properties

### fallbackCache

• `Private` **fallbackCache**: `Map`\<[`ContentType`](../modules/types_Content.md#contenttype), [`StructuredContent`](../modules/types_Content.md#structuredcontent)\>

#### Defined in

[server/src/services/contentGeneration/ContentFallbackHandler.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentFallbackHandler.ts#L9)

___

### fallbackDir

• `Private` `Readonly` **fallbackDir**: `string`

#### Defined in

[server/src/services/contentGeneration/ContentFallbackHandler.ts:10](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentFallbackHandler.ts#L10)

___

### logger

• `Private` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Defined in

[server/src/services/contentGeneration/ContentFallbackHandler.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentFallbackHandler.ts#L12)

## Methods

### getFallbackContent

▸ **getFallbackContent**(`request`, `error`): `Promise`\<[`GeneratedContent`](../interfaces/types_Content.GeneratedContent.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |
| `error` | `Error` |

#### Returns

`Promise`\<[`GeneratedContent`](../interfaces/types_Content.GeneratedContent.md)\>

#### Implementation of

[IContentFallbackHandler](../interfaces/services_contentGeneration_interfaces.IContentFallbackHandler.md).[getFallbackContent](../interfaces/services_contentGeneration_interfaces.IContentFallbackHandler.md#getfallbackcontent)

#### Defined in

[server/src/services/contentGeneration/ContentFallbackHandler.ts:38](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentFallbackHandler.ts#L38)

___

### loadFallbackContent

▸ **loadFallbackContent**(): `void`

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/ContentFallbackHandler.ts:16](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentFallbackHandler.ts#L16)

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

#### Implementation of

[IContentFallbackHandler](../interfaces/services_contentGeneration_interfaces.IContentFallbackHandler.md).[shouldRetry](../interfaces/services_contentGeneration_interfaces.IContentFallbackHandler.md#shouldretry)

#### Defined in

[server/src/services/contentGeneration/ContentFallbackHandler.ts:78](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentFallbackHandler.ts#L78)
