[server](../README.md) / [Exports](../modules.md) / [types/Content](../modules/types_Content.md) / ListeningComprehensionItem

# Interface: ListeningComprehensionItem

[types/Content](../modules/types_Content.md).ListeningComprehensionItem

## Table of contents

### Properties

- [audioUrl](types_Content.ListeningComprehensionItem.md#audiourl)
- [questions](types_Content.ListeningComprehensionItem.md#questions)
- [transcript](types_Content.ListeningComprehensionItem.md#transcript)
- [type](types_Content.ListeningComprehensionItem.md#type)

## Properties

### audioUrl

• **audioUrl**: `string`

#### Defined in

[server/src/types/Content.ts:352](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L352)

___

### questions

• **questions**: [`MultipleChoiceItem`](types_Content.MultipleChoiceItem.md)[] \| [`FillInBlankItem`](types_Content.FillInBlankItem.md)[]

#### Defined in

[server/src/types/Content.ts:354](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L354)

___

### transcript

• `Optional` **transcript**: `string`

#### Defined in

[server/src/types/Content.ts:353](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L353)

___

### type

• **type**: ``"listening_comprehension"``

#### Defined in

[server/src/types/Content.ts:351](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/Content.ts#L351)
