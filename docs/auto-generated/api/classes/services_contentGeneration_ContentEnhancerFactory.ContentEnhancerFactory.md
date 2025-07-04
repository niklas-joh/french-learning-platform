[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/ContentEnhancerFactory](../modules/services_contentGeneration_ContentEnhancerFactory.md) / ContentEnhancerFactory

# Class: ContentEnhancerFactory

[services/contentGeneration/ContentEnhancerFactory](../modules/services_contentGeneration_ContentEnhancerFactory.md).ContentEnhancerFactory

Factory interface for content enhancers
Enables different enhancement strategies per content type

## Implements

- [`IContentEnhancerFactory`](../interfaces/services_contentGeneration_interfaces.IContentEnhancerFactory.md)

## Table of contents

### Constructors

- [constructor](services_contentGeneration_ContentEnhancerFactory.ContentEnhancerFactory.md#constructor)

### Properties

- [enhancers](services_contentGeneration_ContentEnhancerFactory.ContentEnhancerFactory.md#enhancers)
- [logger](services_contentGeneration_ContentEnhancerFactory.ContentEnhancerFactory.md#logger)

### Methods

- [getEnhancer](services_contentGeneration_ContentEnhancerFactory.ContentEnhancerFactory.md#getenhancer)

## Constructors

### constructor

• **new ContentEnhancerFactory**(`logger`): [`ContentEnhancerFactory`](services_contentGeneration_ContentEnhancerFactory.ContentEnhancerFactory.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`ContentEnhancerFactory`](services_contentGeneration_ContentEnhancerFactory.ContentEnhancerFactory.md)

#### Defined in

[server/src/services/contentGeneration/ContentEnhancerFactory.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentEnhancerFactory.ts#L9)

## Properties

### enhancers

• `Private` **enhancers**: `Map`\<[`ContentType`](../modules/types_Content.md#contenttype), [`IContentEnhancer`](../interfaces/services_contentGeneration_interfaces.IContentEnhancer.md)\>

#### Defined in

[server/src/services/contentGeneration/ContentEnhancerFactory.ts:7](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentEnhancerFactory.ts#L7)

___

### logger

• `Private` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Defined in

[server/src/services/contentGeneration/ContentEnhancerFactory.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentEnhancerFactory.ts#L9)

## Methods

### getEnhancer

▸ **getEnhancer**(`type`): [`IContentEnhancer`](../interfaces/services_contentGeneration_interfaces.IContentEnhancer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`ContentType`](../modules/types_Content.md#contenttype) |

#### Returns

[`IContentEnhancer`](../interfaces/services_contentGeneration_interfaces.IContentEnhancer.md)

#### Implementation of

[IContentEnhancerFactory](../interfaces/services_contentGeneration_interfaces.IContentEnhancerFactory.md).[getEnhancer](../interfaces/services_contentGeneration_interfaces.IContentEnhancerFactory.md#getenhancer)

#### Defined in

[server/src/services/contentGeneration/ContentEnhancerFactory.ts:17](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentEnhancerFactory.ts#L17)
