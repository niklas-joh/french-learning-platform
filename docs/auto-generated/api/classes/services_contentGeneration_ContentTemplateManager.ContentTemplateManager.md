[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/ContentTemplateManager](../modules/services_contentGeneration_ContentTemplateManager.md) / ContentTemplateManager

# Class: ContentTemplateManager

[services/contentGeneration/ContentTemplateManager](../modules/services_contentGeneration_ContentTemplateManager.md).ContentTemplateManager

Interface for content template management
Provides structured templates for different content types

## Implements

- [`IContentTemplateManager`](../interfaces/services_contentGeneration_interfaces.IContentTemplateManager.md)

## Table of contents

### Constructors

- [constructor](services_contentGeneration_ContentTemplateManager.ContentTemplateManager.md#constructor)

### Properties

- [logger](services_contentGeneration_ContentTemplateManager.ContentTemplateManager.md#logger)
- [templateCache](services_contentGeneration_ContentTemplateManager.ContentTemplateManager.md#templatecache)
- [templateDir](services_contentGeneration_ContentTemplateManager.ContentTemplateManager.md#templatedir)

### Methods

- [getTemplate](services_contentGeneration_ContentTemplateManager.ContentTemplateManager.md#gettemplate)
- [loadTemplates](services_contentGeneration_ContentTemplateManager.ContentTemplateManager.md#loadtemplates)

## Constructors

### constructor

• **new ContentTemplateManager**(`logger`): [`ContentTemplateManager`](services_contentGeneration_ContentTemplateManager.ContentTemplateManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`ContentTemplateManager`](services_contentGeneration_ContentTemplateManager.ContentTemplateManager.md)

#### Defined in

[server/src/services/contentGeneration/ContentTemplateManager.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentTemplateManager.ts#L11)

## Properties

### logger

• `Private` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Defined in

[server/src/services/contentGeneration/ContentTemplateManager.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentTemplateManager.ts#L11)

___

### templateCache

• `Private` **templateCache**: `Map`\<[`ContentType`](../modules/types_Content.md#contenttype), [`ContentTemplate`](../interfaces/types_Content.ContentTemplate.md)\>

#### Defined in

[server/src/services/contentGeneration/ContentTemplateManager.ts:8](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentTemplateManager.ts#L8)

___

### templateDir

• `Private` `Readonly` **templateDir**: `string`

#### Defined in

[server/src/services/contentGeneration/ContentTemplateManager.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentTemplateManager.ts#L9)

## Methods

### getTemplate

▸ **getTemplate**(`type`, `context`): [`ContentTemplate`](../interfaces/types_Content.ContentTemplate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`ContentType`](../modules/types_Content.md#contenttype) |
| `context` | [`LearningContext`](../interfaces/types_Content.LearningContext.md) |

#### Returns

[`ContentTemplate`](../interfaces/types_Content.ContentTemplate.md)

#### Implementation of

[IContentTemplateManager](../interfaces/services_contentGeneration_interfaces.IContentTemplateManager.md).[getTemplate](../interfaces/services_contentGeneration_interfaces.IContentTemplateManager.md#gettemplate)

#### Defined in

[server/src/services/contentGeneration/ContentTemplateManager.ts:36](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentTemplateManager.ts#L36)

___

### loadTemplates

▸ **loadTemplates**(): `void`

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/ContentTemplateManager.ts:15](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentTemplateManager.ts#L15)
