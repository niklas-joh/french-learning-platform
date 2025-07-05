[server](../README.md) / [Exports](../modules.md) / [services/ai/ContentEnhancer](../modules/services_ai_ContentEnhancer.md) / ContentEnhancer

# Class: ContentEnhancer

[services/ai/ContentEnhancer](../modules/services_ai_ContentEnhancer.md).ContentEnhancer

Interface for content enhancement services
Adds personalization and optimization to generated content

## Implements

- [`IContentEnhancer`](../interfaces/services_contentGeneration_interfaces.IContentEnhancer.md)

## Table of contents

### Constructors

- [constructor](services_ai_ContentEnhancer.ContentEnhancer.md#constructor)

### Properties

- [enhancementRules](services_ai_ContentEnhancer.ContentEnhancer.md#enhancementrules)

### Methods

- [adaptExerciseDifficulty](services_ai_ContentEnhancer.ContentEnhancer.md#adaptexercisedifficulty)
- [addCulturalNotes](services_ai_ContentEnhancer.ContentEnhancer.md#addculturalnotes)
- [addMultimediaSuggestions](services_ai_ContentEnhancer.ContentEnhancer.md#addmultimediasuggestions)
- [enhance](services_ai_ContentEnhancer.ContentEnhancer.md#enhance)
- [initializeEnhancementRules](services_ai_ContentEnhancer.ContentEnhancer.md#initializeenhancementrules)
- [optimizeLearningObjectives](services_ai_ContentEnhancer.ContentEnhancer.md#optimizelearningobjectives)
- [personalizeVocabulary](services_ai_ContentEnhancer.ContentEnhancer.md#personalizevocabulary)

## Constructors

### constructor

• **new ContentEnhancer**(): [`ContentEnhancer`](services_ai_ContentEnhancer.ContentEnhancer.md)

#### Returns

[`ContentEnhancer`](services_ai_ContentEnhancer.ContentEnhancer.md)

#### Defined in

[server/src/services/ai/ContentEnhancer.ts:39](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContentEnhancer.ts#L39)

## Properties

### enhancementRules

• `Private` `Readonly` **enhancementRules**: `EnhancementRule`[]

#### Defined in

[server/src/services/ai/ContentEnhancer.ts:37](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContentEnhancer.ts#L37)

## Methods

### adaptExerciseDifficulty

▸ **adaptExerciseDifficulty**(`exercises`, `context`): [`Exercise`](../interfaces/types_Content.Exercise.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `exercises` | [`Exercise`](../interfaces/types_Content.Exercise.md)[] |
| `context` | [`LearningContext`](../interfaces/types_Content.LearningContext.md) |

#### Returns

[`Exercise`](../interfaces/types_Content.Exercise.md)[]

#### Defined in

[server/src/services/ai/ContentEnhancer.ts:144](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContentEnhancer.ts#L144)

___

### addCulturalNotes

▸ **addCulturalNotes**(`content`, `context`): [`StructuredContent`](../modules/types_Content.md#structuredcontent)

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](../modules/types_Content.md#structuredcontent) |
| `context` | [`LearningContext`](../interfaces/types_Content.LearningContext.md) |

#### Returns

[`StructuredContent`](../modules/types_Content.md#structuredcontent)

#### Defined in

[server/src/services/ai/ContentEnhancer.ts:155](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContentEnhancer.ts#L155)

___

### addMultimediaSuggestions

▸ **addMultimediaSuggestions**(`text`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`string`

#### Defined in

[server/src/services/ai/ContentEnhancer.ts:182](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContentEnhancer.ts#L182)

___

### enhance

▸ **enhance**(`content`, `context`): `Promise`\<[`StructuredContent`](../modules/types_Content.md#structuredcontent)\>

Main enhancement method that applies all enhancement rules in order of priority

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](../modules/types_Content.md#structuredcontent) |
| `context` | [`LearningContext`](../interfaces/types_Content.LearningContext.md) |

#### Returns

`Promise`\<[`StructuredContent`](../modules/types_Content.md#structuredcontent)\>

#### Implementation of

[IContentEnhancer](../interfaces/services_contentGeneration_interfaces.IContentEnhancer.md).[enhance](../interfaces/services_contentGeneration_interfaces.IContentEnhancer.md#enhance)

#### Defined in

[server/src/services/ai/ContentEnhancer.ts:46](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContentEnhancer.ts#L46)

___

### initializeEnhancementRules

▸ **initializeEnhancementRules**(): `EnhancementRule`[]

Initialize all enhancement rules

#### Returns

`EnhancementRule`[]

#### Defined in

[server/src/services/ai/ContentEnhancer.ts:68](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContentEnhancer.ts#L68)

___

### optimizeLearningObjectives

▸ **optimizeLearningObjectives**(`objectives`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectives` | `string`[] |

#### Returns

`string`[]

#### Defined in

[server/src/services/ai/ContentEnhancer.ts:169](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContentEnhancer.ts#L169)

___

### personalizeVocabulary

▸ **personalizeVocabulary**(`vocabulary`, `context`): [`VocabularyItem`](../interfaces/types_Content.VocabularyItem.md)[]

Helper methods for enhancement rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `vocabulary` | [`VocabularyItem`](../interfaces/types_Content.VocabularyItem.md)[] |
| `context` | [`LearningContext`](../interfaces/types_Content.LearningContext.md) |

#### Returns

[`VocabularyItem`](../interfaces/types_Content.VocabularyItem.md)[]

#### Defined in

[server/src/services/ai/ContentEnhancer.ts:127](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/ContentEnhancer.ts#L127)
