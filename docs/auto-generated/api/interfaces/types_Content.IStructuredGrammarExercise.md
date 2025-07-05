[server](../README.md) / [Exports](../modules.md) / [types/Content](../modules/types_Content.md) / IStructuredGrammarExercise

# Interface: IStructuredGrammarExercise

[types/Content](../modules/types_Content.md).IStructuredGrammarExercise

Base interface for all structured content types (DRY principle)

## Hierarchy

- [`BaseStructuredContent`](types_Content.BaseStructuredContent.md)

  ↳ **`IStructuredGrammarExercise`**

## Table of contents

### Properties

- [commonMistakes](types_Content.IStructuredGrammarExercise.md#commonmistakes)
- [description](types_Content.IStructuredGrammarExercise.md#description)
- [estimatedTime](types_Content.IStructuredGrammarExercise.md#estimatedtime)
- [examples](types_Content.IStructuredGrammarExercise.md#examples)
- [exercises](types_Content.IStructuredGrammarExercise.md#exercises)
- [explanation](types_Content.IStructuredGrammarExercise.md#explanation)
- [grammarRule](types_Content.IStructuredGrammarExercise.md#grammarrule)
- [learningObjectives](types_Content.IStructuredGrammarExercise.md#learningobjectives)
- [tips](types_Content.IStructuredGrammarExercise.md#tips)
- [title](types_Content.IStructuredGrammarExercise.md#title)
- [type](types_Content.IStructuredGrammarExercise.md#type)

## Properties

### commonMistakes

• **commonMistakes**: `string`[]

#### Defined in

[server/src/types/Content.ts:171](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L171)

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

### examples

• **examples**: `string`[]

#### Defined in

[server/src/types/Content.ts:168](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L168)

___

### exercises

• **exercises**: [`Exercise`](types_Content.Exercise.md)[]

#### Defined in

[server/src/types/Content.ts:169](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L169)

___

### explanation

• **explanation**: `string`

#### Defined in

[server/src/types/Content.ts:167](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L167)

___

### grammarRule

• **grammarRule**: `string`

#### Defined in

[server/src/types/Content.ts:166](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L166)

___

### learningObjectives

• **learningObjectives**: `string`[]

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[learningObjectives](types_Content.BaseStructuredContent.md#learningobjectives)

#### Defined in

[server/src/types/Content.ts:134](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L134)

___

### tips

• **tips**: `string`[]

#### Defined in

[server/src/types/Content.ts:170](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L170)

___

### title

• **title**: `string`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[title](types_Content.BaseStructuredContent.md#title)

#### Defined in

[server/src/types/Content.ts:132](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L132)

___

### type

• **type**: ``"grammar_exercise"``

#### Overrides

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[type](types_Content.BaseStructuredContent.md#type)

#### Defined in

[server/src/types/Content.ts:165](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L165)
