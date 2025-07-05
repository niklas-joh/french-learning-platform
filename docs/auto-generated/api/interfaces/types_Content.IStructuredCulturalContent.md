[server](../README.md) / [Exports](../modules.md) / [types/Content](../modules/types_Content.md) / IStructuredCulturalContent

# Interface: IStructuredCulturalContent

[types/Content](../modules/types_Content.md).IStructuredCulturalContent

Base interface for all structured content types (DRY principle)

## Hierarchy

- [`BaseStructuredContent`](types_Content.BaseStructuredContent.md)

  ↳ **`IStructuredCulturalContent`**

## Table of contents

### Properties

- [connections](types_Content.IStructuredCulturalContent.md#connections)
- [description](types_Content.IStructuredCulturalContent.md#description)
- [discussionQuestions](types_Content.IStructuredCulturalContent.md#discussionquestions)
- [estimatedTime](types_Content.IStructuredCulturalContent.md#estimatedtime)
- [keyPoints](types_Content.IStructuredCulturalContent.md#keypoints)
- [learningObjectives](types_Content.IStructuredCulturalContent.md#learningobjectives)
- [multimedia](types_Content.IStructuredCulturalContent.md#multimedia)
- [title](types_Content.IStructuredCulturalContent.md#title)
- [topic](types_Content.IStructuredCulturalContent.md#topic)
- [type](types_Content.IStructuredCulturalContent.md#type)
- [vocabulary](types_Content.IStructuredCulturalContent.md#vocabulary)

## Properties

### connections

• **connections**: `string`[]

#### Defined in

[server/src/types/Content.ts:181](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L181)

___

### description

• **description**: `string`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[description](types_Content.BaseStructuredContent.md#description)

#### Defined in

[server/src/types/Content.ts:133](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L133)

___

### discussionQuestions

• **discussionQuestions**: `string`[]

#### Defined in

[server/src/types/Content.ts:179](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L179)

___

### estimatedTime

• **estimatedTime**: `number`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[estimatedTime](types_Content.BaseStructuredContent.md#estimatedtime)

#### Defined in

[server/src/types/Content.ts:135](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L135)

___

### keyPoints

• **keyPoints**: `string`[]

#### Defined in

[server/src/types/Content.ts:177](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L177)

___

### learningObjectives

• **learningObjectives**: `string`[]

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[learningObjectives](types_Content.BaseStructuredContent.md#learningobjectives)

#### Defined in

[server/src/types/Content.ts:134](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L134)

___

### multimedia

• `Optional` **multimedia**: [`MultimediaItem`](types_Content.MultimediaItem.md)[]

#### Defined in

[server/src/types/Content.ts:180](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L180)

___

### title

• **title**: `string`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[title](types_Content.BaseStructuredContent.md#title)

#### Defined in

[server/src/types/Content.ts:132](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L132)

___

### topic

• **topic**: `string`

#### Defined in

[server/src/types/Content.ts:176](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L176)

___

### type

• **type**: ``"cultural_content"``

#### Overrides

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[type](types_Content.BaseStructuredContent.md#type)

#### Defined in

[server/src/types/Content.ts:175](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L175)

___

### vocabulary

• **vocabulary**: [`VocabularyItem`](types_Content.VocabularyItem.md)[]

#### Defined in

[server/src/types/Content.ts:178](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L178)
