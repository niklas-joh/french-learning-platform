[server](../README.md) / [Exports](../modules.md) / [types/Content](../modules/types_Content.md) / ContentRequest

# Interface: ContentRequest

[types/Content](../modules/types_Content.md).ContentRequest

Content generation request with improved organization and validation
TODO: Reference Future Implementation #21 - AI Type System Schema Validation Integration

## Table of contents

### Properties

- [context](types_Content.ContentRequest.md#context)
- [culturalTopic](types_Content.ContentRequest.md#culturaltopic)
- [difficulty](types_Content.ContentRequest.md#difficulty)
- [duration](types_Content.ContentRequest.md#duration)
- [exerciseCount](types_Content.ContentRequest.md#exercisecount)
- [focusAreas](types_Content.ContentRequest.md#focusareas)
- [grammarFocus](types_Content.ContentRequest.md#grammarfocus)
- [learningStyle](types_Content.ContentRequest.md#learningstyle)
- [level](types_Content.ContentRequest.md#level)
- [options](types_Content.ContentRequest.md#options)
- [topics](types_Content.ContentRequest.md#topics)
- [type](types_Content.ContentRequest.md#type)
- [userId](types_Content.ContentRequest.md#userid)
- [vocabulary](types_Content.ContentRequest.md#vocabulary)

## Properties

### context

• `Optional` **context**: `string`

#### Defined in

[server/src/types/Content.ts:37](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L37)

___

### culturalTopic

• `Optional` **culturalTopic**: `string`

#### Defined in

[server/src/types/Content.ts:41](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L41)

___

### difficulty

• `Optional` **difficulty**: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` \| ``"adaptive"``

#### Defined in

[server/src/types/Content.ts:39](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L39)

___

### duration

• `Optional` **duration**: `number`

#### Defined in

[server/src/types/Content.ts:33](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L33)

___

### exerciseCount

• `Optional` **exerciseCount**: `number`

#### Defined in

[server/src/types/Content.ts:40](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L40)

___

### focusAreas

• `Optional` **focusAreas**: `string`[]

#### Defined in

[server/src/types/Content.ts:34](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L34)

___

### grammarFocus

• `Optional` **grammarFocus**: `string`

#### Defined in

[server/src/types/Content.ts:38](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L38)

___

### learningStyle

• `Optional` **learningStyle**: ``"visual"`` \| ``"auditory"`` \| ``"kinesthetic"`` \| ``"mixed"``

#### Defined in

[server/src/types/Content.ts:35](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L35)

___

### level

• `Optional` **level**: `string`

#### Defined in

[server/src/types/Content.ts:31](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L31)

___

### options

• `Optional` **options**: [`ContentGenerationOptions`](types_Content.ContentGenerationOptions.md)

#### Defined in

[server/src/types/Content.ts:42](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L42)

___

### topics

• `Optional` **topics**: `string`[]

#### Defined in

[server/src/types/Content.ts:32](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L32)

___

### type

• **type**: [`ContentType`](../modules/types_Content.md#contenttype)

#### Defined in

[server/src/types/Content.ts:30](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L30)

___

### userId

• **userId**: `number`

#### Defined in

[server/src/types/Content.ts:29](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L29)

___

### vocabulary

• `Optional` **vocabulary**: `string`[]

#### Defined in

[server/src/types/Content.ts:36](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/Content.ts#L36)
