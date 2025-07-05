[server](../README.md) / [Exports](../modules.md) / types/Content

# Module: types/Content

## Table of contents

### Interfaces

- [AdaptiveElement](../interfaces/types_Content.AdaptiveElement.md)
- [BaseStructuredContent](../interfaces/types_Content.BaseStructuredContent.md)
- [BlankPosition](../interfaces/types_Content.BlankPosition.md)
- [ContentGenerationOptions](../interfaces/types_Content.ContentGenerationOptions.md)
- [ContentMetadata](../interfaces/types_Content.ContentMetadata.md)
- [ContentRequest](../interfaces/types_Content.ContentRequest.md)
- [ContentTemplate](../interfaces/types_Content.ContentTemplate.md)
- [ContentValidation](../interfaces/types_Content.ContentValidation.md)
- [CulturalNote](../interfaces/types_Content.CulturalNote.md)
- [DragDropItem](../interfaces/types_Content.DragDropItem.md)
- [DraggableItem](../interfaces/types_Content.DraggableItem.md)
- [DropZone](../interfaces/types_Content.DropZone.md)
- [Exercise](../interfaces/types_Content.Exercise.md)
- [FillInBlankItem](../interfaces/types_Content.FillInBlankItem.md)
- [GeneratedContent](../interfaces/types_Content.GeneratedContent.md)
- [GrammarConcept](../interfaces/types_Content.GrammarConcept.md)
- [IStructuredCulturalContent](../interfaces/types_Content.IStructuredCulturalContent.md)
- [IStructuredGrammarExercise](../interfaces/types_Content.IStructuredGrammarExercise.md)
- [IStructuredLesson](../interfaces/types_Content.IStructuredLesson.md)
- [IStructuredPersonalizedExercise](../interfaces/types_Content.IStructuredPersonalizedExercise.md)
- [IStructuredVocabularyDrill](../interfaces/types_Content.IStructuredVocabularyDrill.md)
- [LearningContext](../interfaces/types_Content.LearningContext.md)
- [LessonSection](../interfaces/types_Content.LessonSection.md)
- [ListeningComprehensionItem](../interfaces/types_Content.ListeningComprehensionItem.md)
- [MatchPair](../interfaces/types_Content.MatchPair.md)
- [MatchingItem](../interfaces/types_Content.MatchingItem.md)
- [MultimediaItem](../interfaces/types_Content.MultimediaItem.md)
- [MultipleChoiceItem](../interfaces/types_Content.MultipleChoiceItem.md)
- [OrderingItem](../interfaces/types_Content.OrderingItem.md)
- [PronunciationPracticeItem](../interfaces/types_Content.PronunciationPracticeItem.md)
- [TrueFalseItem](../interfaces/types_Content.TrueFalseItem.md)
- [VocabularyItem](../interfaces/types_Content.VocabularyItem.md)

### Type Aliases

- [ContentType](types_Content.md#contenttype)
- [ExerciseItem](types_Content.md#exerciseitem)
- [ExerciseType](types_Content.md#exercisetype)
- [StructuredContent](types_Content.md#structuredcontent)

### Functions

- [generateContentId](types_Content.md#generatecontentid)
- [isCulturalContent](types_Content.md#isculturalcontent)
- [isGrammarExercise](types_Content.md#isgrammarexercise)
- [isLesson](types_Content.md#islesson)
- [isPersonalizedExercise](types_Content.md#ispersonalizedexercise)
- [isVocabularyDrill](types_Content.md#isvocabularydrill)

## Type Aliases

### ContentType

Ƭ **ContentType**: ``"lesson"`` \| ``"vocabulary_drill"`` \| ``"grammar_exercise"`` \| ``"cultural_content"`` \| ``"personalized_exercise"`` \| ``"pronunciation_drill"`` \| ``"conversation_practice"``

#### Defined in

[server/src/types/Content.ts:114](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L114)

___

### ExerciseItem

Ƭ **ExerciseItem**: [`MultipleChoiceItem`](../interfaces/types_Content.MultipleChoiceItem.md) \| [`FillInBlankItem`](../interfaces/types_Content.FillInBlankItem.md) \| [`MatchingItem`](../interfaces/types_Content.MatchingItem.md) \| [`OrderingItem`](../interfaces/types_Content.OrderingItem.md) \| [`TrueFalseItem`](../interfaces/types_Content.TrueFalseItem.md) \| [`DragDropItem`](../interfaces/types_Content.DragDropItem.md) \| [`ListeningComprehensionItem`](../interfaces/types_Content.ListeningComprehensionItem.md) \| [`PronunciationPracticeItem`](../interfaces/types_Content.PronunciationPracticeItem.md)

Discriminated union for strongly-typed exercise items
Replaces the problematic `any[]` from original design

#### Defined in

[server/src/types/Content.ts:275](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L275)

___

### ExerciseType

Ƭ **ExerciseType**: ``"multiple_choice"`` \| ``"fill_in_blank"`` \| ``"matching"`` \| ``"ordering"`` \| ``"true_false"`` \| ``"drag_drop"`` \| ``"listening_comprehension"`` \| ``"pronunciation_practice"``

#### Defined in

[server/src/types/Content.ts:261](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L261)

___

### StructuredContent

Ƭ **StructuredContent**: [`IStructuredLesson`](../interfaces/types_Content.IStructuredLesson.md) \| [`IStructuredVocabularyDrill`](../interfaces/types_Content.IStructuredVocabularyDrill.md) \| [`IStructuredGrammarExercise`](../interfaces/types_Content.IStructuredGrammarExercise.md) \| [`IStructuredCulturalContent`](../interfaces/types_Content.IStructuredCulturalContent.md) \| [`IStructuredPersonalizedExercise`](../interfaces/types_Content.IStructuredPersonalizedExercise.md)

Discriminated union for type-safe content structures

#### Defined in

[server/src/types/Content.ts:141](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L141)

## Functions

### generateContentId

▸ **generateContentId**(): `string`

Generates a unique content ID using UUID
Replaces the insecure Date.now() + Math.random() approach

#### Returns

`string`

#### Defined in

[server/src/types/Content.ts:373](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L373)

___

### isCulturalContent

▸ **isCulturalContent**(`content`): content is IStructuredCulturalContent

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](types_Content.md#structuredcontent) |

#### Returns

content is IStructuredCulturalContent

#### Defined in

[server/src/types/Content.ts:392](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L392)

___

### isGrammarExercise

▸ **isGrammarExercise**(`content`): content is IStructuredGrammarExercise

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](types_Content.md#structuredcontent) |

#### Returns

content is IStructuredGrammarExercise

#### Defined in

[server/src/types/Content.ts:388](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L388)

___

### isLesson

▸ **isLesson**(`content`): content is IStructuredLesson

Type guard functions for content type checking

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](types_Content.md#structuredcontent) |

#### Returns

content is IStructuredLesson

#### Defined in

[server/src/types/Content.ts:380](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L380)

___

### isPersonalizedExercise

▸ **isPersonalizedExercise**(`content`): content is IStructuredPersonalizedExercise

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](types_Content.md#structuredcontent) |

#### Returns

content is IStructuredPersonalizedExercise

#### Defined in

[server/src/types/Content.ts:396](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L396)

___

### isVocabularyDrill

▸ **isVocabularyDrill**(`content`): content is IStructuredVocabularyDrill

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](types_Content.md#structuredcontent) |

#### Returns

content is IStructuredVocabularyDrill

#### Defined in

[server/src/types/Content.ts:384](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L384)
