[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IContentEnhancer

# Interface: IContentEnhancer

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IContentEnhancer

Interface for content enhancement services
Adds personalization and optimization to generated content

## Implemented by

- [`BaseEnhancer`](../classes/services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md)
- [`ContentEnhancer`](../classes/services_ai_ContentEnhancer.ContentEnhancer.md)

## Table of contents

### Methods

- [enhance](services_contentGeneration_interfaces.IContentEnhancer.md#enhance)

## Methods

### enhance

▸ **enhance**(`content`, `context`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `any` |
| `context` | [`LearningContext`](types_Content.LearningContext.md) |

#### Returns

`Promise`\<`any`\>

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:48](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L48)
