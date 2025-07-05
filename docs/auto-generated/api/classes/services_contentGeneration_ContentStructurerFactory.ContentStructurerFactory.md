[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/ContentStructurerFactory](../modules/services_contentGeneration_ContentStructurerFactory.md) / ContentStructurerFactory

# Class: ContentStructurerFactory

[services/contentGeneration/ContentStructurerFactory](../modules/services_contentGeneration_ContentStructurerFactory.md).ContentStructurerFactory

## Table of contents

### Constructors

- [constructor](services_contentGeneration_ContentStructurerFactory.ContentStructurerFactory.md#constructor)

### Properties

- [structurers](services_contentGeneration_ContentStructurerFactory.ContentStructurerFactory.md#structurers)

### Methods

- [getStructurer](services_contentGeneration_ContentStructurerFactory.ContentStructurerFactory.md#getstructurer)

## Constructors

### constructor

• **new ContentStructurerFactory**(): [`ContentStructurerFactory`](services_contentGeneration_ContentStructurerFactory.ContentStructurerFactory.md)

#### Returns

[`ContentStructurerFactory`](services_contentGeneration_ContentStructurerFactory.ContentStructurerFactory.md)

#### Defined in

[server/src/services/contentGeneration/ContentStructurerFactory.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/ContentStructurerFactory.ts#L9)

## Properties

### structurers

• `Private` **structurers**: `Map`\<[`ContentType`](../modules/types_Content.md#contenttype), [`IContentStructurer`](../interfaces/services_contentGeneration_IContentStructurer.IContentStructurer.md)\<[`StructuredContent`](../modules/types_Content.md#structuredcontent)\>\>

#### Defined in

[server/src/services/contentGeneration/ContentStructurerFactory.ts:7](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/ContentStructurerFactory.ts#L7)

## Methods

### getStructurer

▸ **getStructurer**(`contentType`): [`IContentStructurer`](../interfaces/services_contentGeneration_IContentStructurer.IContentStructurer.md)\<[`StructuredContent`](../modules/types_Content.md#structuredcontent)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | [`ContentType`](../modules/types_Content.md#contenttype) |

#### Returns

[`IContentStructurer`](../interfaces/services_contentGeneration_IContentStructurer.IContentStructurer.md)\<[`StructuredContent`](../modules/types_Content.md#structuredcontent)\>

#### Defined in

[server/src/services/contentGeneration/ContentStructurerFactory.ts:16](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/ContentStructurerFactory.ts#L16)
