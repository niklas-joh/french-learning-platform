[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/enhancers/BaseEnhancer](../modules/services_contentGeneration_enhancers_BaseEnhancer.md) / BaseEnhancer

# Class: BaseEnhancer

[services/contentGeneration/enhancers/BaseEnhancer](../modules/services_contentGeneration_enhancers_BaseEnhancer.md).BaseEnhancer

Abstract base class for content enhancers.
Provides a consistent structure for all enhancer implementations.

## Hierarchy

- **`BaseEnhancer`**

  ↳ [`LessonEnhancer`](services_contentGeneration_enhancers_LessonEnhancer.LessonEnhancer.md)

## Implements

- [`IContentEnhancer`](../interfaces/services_contentGeneration_interfaces.IContentEnhancer.md)

## Table of contents

### Constructors

- [constructor](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md#constructor)

### Properties

- [contentType](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md#contenttype)
- [logger](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md#logger)

### Methods

- [enhance](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md#enhance)

## Constructors

### constructor

• **new BaseEnhancer**(`logger`): [`BaseEnhancer`](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`BaseEnhancer`](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md)

#### Defined in

[server/src/services/contentGeneration/enhancers/BaseEnhancer.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/enhancers/BaseEnhancer.ts#L12)

## Properties

### contentType

• `Protected` `Readonly` `Abstract` **contentType**: [`ContentType`](../modules/types_Content.md#contenttype)

#### Defined in

[server/src/services/contentGeneration/enhancers/BaseEnhancer.ts:10](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/enhancers/BaseEnhancer.ts#L10)

___

### logger

• `Protected` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Defined in

[server/src/services/contentGeneration/enhancers/BaseEnhancer.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/enhancers/BaseEnhancer.ts#L12)

## Methods

### enhance

▸ **enhance**(`content`, `context`): `Promise`\<`any`\>

Abstract method to be implemented by concrete enhancer classes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | `any` | The content to enhance, specific to the content type. |
| `context` | [`LearningContext`](../interfaces/types_Content.LearningContext.md) | The user's learning context. |

#### Returns

`Promise`\<`any`\>

A promise that resolves to the enhanced content.

#### Implementation of

[IContentEnhancer](../interfaces/services_contentGeneration_interfaces.IContentEnhancer.md).[enhance](../interfaces/services_contentGeneration_interfaces.IContentEnhancer.md#enhance)

#### Defined in

[server/src/services/contentGeneration/enhancers/BaseEnhancer.ts:20](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/enhancers/BaseEnhancer.ts#L20)
