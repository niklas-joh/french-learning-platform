[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IContentTemplateManager

# Interface: IContentTemplateManager

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IContentTemplateManager

Interface for content template management
Provides structured templates for different content types

## Implemented by

- [`ContentTemplateManager`](../classes/services_contentGeneration_ContentTemplateManager.ContentTemplateManager.md)

## Table of contents

### Methods

- [getTemplate](services_contentGeneration_interfaces.IContentTemplateManager.md#gettemplate)

## Methods

### getTemplate

▸ **getTemplate**(`type`, `context`): [`ContentTemplate`](types_Content.ContentTemplate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`ContentType`](../modules/types_Content.md#contenttype) |
| `context` | [`LearningContext`](types_Content.LearningContext.md) |

#### Returns

[`ContentTemplate`](types_Content.ContentTemplate.md)

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:56](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L56)
