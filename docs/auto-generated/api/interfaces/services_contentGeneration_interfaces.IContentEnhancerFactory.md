[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IContentEnhancerFactory

# Interface: IContentEnhancerFactory

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IContentEnhancerFactory

Factory interface for content enhancers
Enables different enhancement strategies per content type

## Implemented by

- [`ContentEnhancerFactory`](../classes/services_contentGeneration_ContentEnhancerFactory.ContentEnhancerFactory.md)

## Table of contents

### Methods

- [getEnhancer](services_contentGeneration_interfaces.IContentEnhancerFactory.md#getenhancer)

## Methods

### getEnhancer

▸ **getEnhancer**(`type`): [`IContentEnhancer`](services_contentGeneration_interfaces.IContentEnhancer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`ContentType`](../modules/types_Content.md#contenttype) |

#### Returns

[`IContentEnhancer`](services_contentGeneration_interfaces.IContentEnhancer.md)

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:77](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L77)
