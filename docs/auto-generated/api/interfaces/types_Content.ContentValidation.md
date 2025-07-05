[server](../README.md) / [Exports](../modules.md) / [types/Content](../modules/types_Content.md) / ContentValidation

# Interface: ContentValidation

[types/Content](../modules/types_Content.md).ContentValidation

## Table of contents

### Properties

- [confidence](types_Content.ContentValidation.md#confidence)
- [isValid](types_Content.ContentValidation.md#isvalid)
- [issues](types_Content.ContentValidation.md#issues)
- [score](types_Content.ContentValidation.md#score)
- [suggestions](types_Content.ContentValidation.md#suggestions)

## Properties

### confidence

• `Optional` **confidence**: `number`

A score from 0 to 1 indicating the AI's confidence in its own validation

#### Defined in

[server/src/types/Content.ts:82](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L82)

___

### isValid

• **isValid**: `boolean`

#### Defined in

[server/src/types/Content.ts:76](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L76)

___

### issues

• **issues**: `string`[]

#### Defined in

[server/src/types/Content.ts:79](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L79)

___

### score

• **score**: `number`

A score from 0 to 1 indicating the quality and relevance of the content

#### Defined in

[server/src/types/Content.ts:78](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L78)

___

### suggestions

• `Optional` **suggestions**: `string`[]

#### Defined in

[server/src/types/Content.ts:80](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L80)
