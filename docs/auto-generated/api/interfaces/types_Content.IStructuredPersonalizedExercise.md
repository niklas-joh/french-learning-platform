[server](../README.md) / [Exports](../modules.md) / [types/Content](../modules/types_Content.md) / IStructuredPersonalizedExercise

# Interface: IStructuredPersonalizedExercise

[types/Content](../modules/types_Content.md).IStructuredPersonalizedExercise

Base interface for all structured content types (DRY principle)

## Hierarchy

- [`BaseStructuredContent`](types_Content.BaseStructuredContent.md)

  ↳ **`IStructuredPersonalizedExercise`**

## Table of contents

### Properties

- [adaptiveElements](types_Content.IStructuredPersonalizedExercise.md#adaptiveelements)
- [description](types_Content.IStructuredPersonalizedExercise.md#description)
- [estimatedTime](types_Content.IStructuredPersonalizedExercise.md#estimatedtime)
- [exercises](types_Content.IStructuredPersonalizedExercise.md#exercises)
- [focusAreas](types_Content.IStructuredPersonalizedExercise.md#focusareas)
- [learningObjectives](types_Content.IStructuredPersonalizedExercise.md#learningobjectives)
- [title](types_Content.IStructuredPersonalizedExercise.md#title)
- [type](types_Content.IStructuredPersonalizedExercise.md#type)

## Properties

### adaptiveElements

• **adaptiveElements**: [`AdaptiveElement`](types_Content.AdaptiveElement.md)[]

#### Defined in

[server/src/types/Content.ts:188](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L188)

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

### exercises

• **exercises**: [`Exercise`](types_Content.Exercise.md)[]

#### Defined in

[server/src/types/Content.ts:187](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L187)

___

### focusAreas

• **focusAreas**: `string`[]

#### Defined in

[server/src/types/Content.ts:186](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L186)

___

### learningObjectives

• **learningObjectives**: `string`[]

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[learningObjectives](types_Content.BaseStructuredContent.md#learningobjectives)

#### Defined in

[server/src/types/Content.ts:134](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L134)

___

### title

• **title**: `string`

#### Inherited from

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[title](types_Content.BaseStructuredContent.md#title)

#### Defined in

[server/src/types/Content.ts:132](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L132)

___

### type

• **type**: ``"personalized_exercise"``

#### Overrides

[BaseStructuredContent](types_Content.BaseStructuredContent.md).[type](types_Content.BaseStructuredContent.md#type)

#### Defined in

[server/src/types/Content.ts:185](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L185)
