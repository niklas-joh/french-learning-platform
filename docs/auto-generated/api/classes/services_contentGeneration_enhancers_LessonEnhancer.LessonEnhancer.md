[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/enhancers/LessonEnhancer](../modules/services_contentGeneration_enhancers_LessonEnhancer.md) / LessonEnhancer

# Class: LessonEnhancer

[services/contentGeneration/enhancers/LessonEnhancer](../modules/services_contentGeneration_enhancers_LessonEnhancer.md).LessonEnhancer

Concrete enhancer for Lesson content.

## Hierarchy

- [`BaseEnhancer`](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md)

  ↳ **`LessonEnhancer`**

## Table of contents

### Constructors

- [constructor](services_contentGeneration_enhancers_LessonEnhancer.LessonEnhancer.md#constructor)

### Properties

- [contentType](services_contentGeneration_enhancers_LessonEnhancer.LessonEnhancer.md#contenttype)
- [logger](services_contentGeneration_enhancers_LessonEnhancer.LessonEnhancer.md#logger)

### Methods

- [enhance](services_contentGeneration_enhancers_LessonEnhancer.LessonEnhancer.md#enhance)

## Constructors

### constructor

• **new LessonEnhancer**(`logger`): [`LessonEnhancer`](services_contentGeneration_enhancers_LessonEnhancer.LessonEnhancer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`LessonEnhancer`](services_contentGeneration_enhancers_LessonEnhancer.LessonEnhancer.md)

#### Overrides

[BaseEnhancer](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md).[constructor](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md#constructor)

#### Defined in

[server/src/services/contentGeneration/enhancers/LessonEnhancer.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/enhancers/LessonEnhancer.ts#L11)

## Properties

### contentType

• `Protected` `Readonly` **contentType**: [`ContentType`](../modules/types_Content.md#contenttype) = `'lesson'`

#### Overrides

[BaseEnhancer](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md).[contentType](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md#contenttype)

#### Defined in

[server/src/services/contentGeneration/enhancers/LessonEnhancer.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/enhancers/LessonEnhancer.ts#L9)

___

### logger

• `Protected` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Inherited from

[BaseEnhancer](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md).[logger](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md#logger)

#### Defined in

[server/src/services/contentGeneration/enhancers/BaseEnhancer.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/enhancers/BaseEnhancer.ts#L12)

## Methods

### enhance

▸ **enhance**(`content`, `context`): `Promise`\<[`IStructuredLesson`](../interfaces/types_Content.IStructuredLesson.md)\>

Enhances the lesson content. For now, this is a simple rule-based enhancement.
Future versions could use AI for more sophisticated enhancements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | [`IStructuredLesson`](../interfaces/types_Content.IStructuredLesson.md) | The lesson content to enhance. |
| `context` | [`LearningContext`](../interfaces/types_Content.LearningContext.md) | The user's learning context. |

#### Returns

`Promise`\<[`IStructuredLesson`](../interfaces/types_Content.IStructuredLesson.md)\>

A promise that resolves to the enhanced lesson content.

#### Overrides

[BaseEnhancer](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md).[enhance](services_contentGeneration_enhancers_BaseEnhancer.BaseEnhancer.md#enhance)

#### Defined in

[server/src/services/contentGeneration/enhancers/LessonEnhancer.ts:22](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/enhancers/LessonEnhancer.ts#L22)
