[server](../README.md) / [Exports](../modules.md) / [types/Content](../modules/types_Content.md) / IStructuredVocabularyDrill

# Interface: IStructuredVocabularyDrill

[types/Content](../modules/types_Content.md).IStructuredVocabularyDrill

Base interface for all structured content types (DRY principle)

## Hierarchy

- [`BaseStructuredContent`](types_Content.BaseStructuredContent.md)

  ↳ **`IStructuredVocabularyDrill`**

## Table of contents

### Properties

- [context](types_Content.IStructuredVocabularyDrill.md#context)
- [culturalContext](types_Content.IStructuredVocabularyDrill.md#culturalcontext)
- [description](types_Content.IStructuredVocabularyDrill.md#description)
- [estimatedTime](types_Content.IStructuredVocabularyDrill.md#estimatedtime)
- [exercises](types_Content.IStructuredVocabularyDrill.md#exercises)
- [learningObjectives](types_Content.IStructuredVocabularyDrill.md#learningobjectives)
- [title](types_Content.IStructuredVocabularyDrill.md#title)
- [type](types_Content.IStructuredVocabularyDrill.md#type)
- [vocabulary](types_Content.IStructuredVocabularyDrill.md#vocabulary)

## Properties

### context

• **context**: `string`

#### Defined in

[server/src/types/Content.ts:158](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L158)

___

### culturalContext

• `Optional` **culturalContext**: `string`

#### Defined in

[server/src/types/Content.ts:161](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L161)

___

### description

• **description**: `string`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[description](types_Content.BaseStructuredContent.md#description)

#### Defined in

[server/src/types/Content.ts:133](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L133)

___

### estimatedTime

• **estimatedTime**: `number`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[estimatedTime](types_Content.BaseStructuredContent.md#estimatedtime)

#### Defined in

[server/src/types/Content.ts:135](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L135)

___

### exercises

• **exercises**: [`Exercise`](types_Content.Exercise.md)[]

#### Defined in

[server/src/types/Content.ts:160](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L160)

___

### learningObjectives

• **learningObjectives**: `string`[]

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[learningObjectives](types_Content.BaseStructuredContent.md#learningobjectives)

#### Defined in

[server/src/types/Content.ts:134](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L134)

___

### title

• **title**: `string`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[title](types_Content.BaseStructuredContent.md#title)

#### Defined in

[server/src/types/Content.ts:132](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L132)

___

### type

• **type**: ``"vocabulary_drill"``

#### Overrides

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[type](types_Content.BaseStructuredContent.md#type)

#### Defined in

[server/src/types/Content.ts:157](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L157)

___

### vocabulary

• **vocabulary**: [`VocabularyItem`](types_Content.VocabularyItem.md)[]

#### Defined in

[server/src/types/Content.ts:159](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L159)
