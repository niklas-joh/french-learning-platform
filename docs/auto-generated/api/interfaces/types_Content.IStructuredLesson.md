[server](../README.md) / [Exports](../modules.md) / [types/Content](../modules/types_Content.md) / IStructuredLesson

# Interface: IStructuredLesson

[types/Content](../modules/types_Content.md).IStructuredLesson

Base interface for all structured content types (DRY principle)

## Hierarchy

- [`BaseStructuredContent`](types_Content.BaseStructuredContent.md)

  ↳ **`IStructuredLesson`**

## Table of contents

### Properties

- [culturalNotes](types_Content.IStructuredLesson.md#culturalnotes)
- [description](types_Content.IStructuredLesson.md#description)
- [estimatedTime](types_Content.IStructuredLesson.md#estimatedtime)
- [grammar](types_Content.IStructuredLesson.md#grammar)
- [learningObjectives](types_Content.IStructuredLesson.md#learningobjectives)
- [sections](types_Content.IStructuredLesson.md#sections)
- [title](types_Content.IStructuredLesson.md#title)
- [type](types_Content.IStructuredLesson.md#type)
- [vocabulary](types_Content.IStructuredLesson.md#vocabulary)

## Properties

### culturalNotes

• `Optional` **culturalNotes**: [`CulturalNote`](types_Content.CulturalNote.md)[]

#### Defined in

[server/src/types/Content.ts:153](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L153)

___

### description

• **description**: `string`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[description](types_Content.BaseStructuredContent.md#description)

#### Defined in

[server/src/types/Content.ts:133](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L133)

___

### estimatedTime

• **estimatedTime**: `number`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[estimatedTime](types_Content.BaseStructuredContent.md#estimatedtime)

#### Defined in

[server/src/types/Content.ts:135](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L135)

___

### grammar

• `Optional` **grammar**: [`GrammarConcept`](types_Content.GrammarConcept.md)

#### Defined in

[server/src/types/Content.ts:152](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L152)

___

### learningObjectives

• **learningObjectives**: `string`[]

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[learningObjectives](types_Content.BaseStructuredContent.md#learningobjectives)

#### Defined in

[server/src/types/Content.ts:134](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L134)

___

### sections

• **sections**: [`LessonSection`](types_Content.LessonSection.md)[]

#### Defined in

[server/src/types/Content.ts:150](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L150)

___

### title

• **title**: `string`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[title](types_Content.BaseStructuredContent.md#title)

#### Defined in

[server/src/types/Content.ts:132](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L132)

___

### type

• **type**: ``"lesson"``

#### Overrides

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[type](types_Content.BaseStructuredContent.md#type)

#### Defined in

[server/src/types/Content.ts:149](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L149)

___

### vocabulary

• **vocabulary**: [`VocabularyItem`](types_Content.VocabularyItem.md)[]

#### Defined in

[server/src/types/Content.ts:151](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L151)
