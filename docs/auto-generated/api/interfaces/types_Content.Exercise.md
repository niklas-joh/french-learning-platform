[server](../README.md) / [Exports](../modules.md) / [types/Content](../modules/types_Content.md) / Exercise

# Interface: Exercise

[types/Content](../modules/types_Content.md).Exercise

Exercise interface with strongly-typed items
Addresses Future Implementation #29 - Enhanced Exercise Type System

## Table of contents

### Properties

- [difficulty](types_Content.Exercise.md#difficulty)
- [estimatedTime](types_Content.Exercise.md#estimatedtime)
- [feedback](types_Content.Exercise.md#feedback)
- [instruction](types_Content.Exercise.md#instruction)
- [items](types_Content.Exercise.md#items)
- [type](types_Content.Exercise.md#type)

## Properties

### difficulty

• `Optional` **difficulty**: ``"easy"`` \| ``"medium"`` \| ``"hard"``

#### Defined in

[server/src/types/Content.ts:257](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L257)

___

### estimatedTime

• `Optional` **estimatedTime**: `number`

#### Defined in

[server/src/types/Content.ts:258](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L258)

___

### feedback

• **feedback**: `string`

#### Defined in

[server/src/types/Content.ts:256](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L256)

___

### instruction

• **instruction**: `string`

#### Defined in

[server/src/types/Content.ts:254](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L254)

___

### items

• **items**: [`ExerciseItem`](../modules/types_Content.md#exerciseitem)[]

#### Defined in

[server/src/types/Content.ts:255](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L255)

___

### type

• **type**: [`ExerciseType`](../modules/types_Content.md#exercisetype)

#### Defined in

[server/src/types/Content.ts:253](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L253)
