[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/VocabularyStructurer](../modules/services_contentGeneration_VocabularyStructurer.md) / VocabularyStructurer

# Class: VocabularyStructurer

[services/contentGeneration/VocabularyStructurer](../modules/services_contentGeneration_VocabularyStructurer.md).VocabularyStructurer

Defines the contract for a class that can structure raw AI content
into a specific, type-safe domain model.

## Implements

- [`IContentStructurer`](../interfaces/services_contentGeneration_IContentStructurer.IContentStructurer.md)\<[`IStructuredVocabularyDrill`](../interfaces/types_Content.IStructuredVocabularyDrill.md)\>

## Table of contents

### Constructors

- [constructor](services_contentGeneration_VocabularyStructurer.VocabularyStructurer.md#constructor)

### Methods

- [structure](services_contentGeneration_VocabularyStructurer.VocabularyStructurer.md#structure)

## Constructors

### constructor

• **new VocabularyStructurer**(): [`VocabularyStructurer`](services_contentGeneration_VocabularyStructurer.VocabularyStructurer.md)

#### Returns

[`VocabularyStructurer`](services_contentGeneration_VocabularyStructurer.VocabularyStructurer.md)

## Methods

### structure

▸ **structure**(`rawContent`): `Promise`\<[`IStructuredVocabularyDrill`](../interfaces/types_Content.IStructuredVocabularyDrill.md)\>

Parses, validates, and transforms a raw JSON string from the AI.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rawContent` | `string` | The raw JSON string. |

#### Returns

`Promise`\<[`IStructuredVocabularyDrill`](../interfaces/types_Content.IStructuredVocabularyDrill.md)\>

A promise that resolves to the structured, type-safe content.

**`Throws`**

An error if parsing, validation, or transformation fails.

#### Implementation of

[IContentStructurer](../interfaces/services_contentGeneration_IContentStructurer.IContentStructurer.md).[structure](../interfaces/services_contentGeneration_IContentStructurer.IContentStructurer.md#structure)

#### Defined in

[server/src/services/contentGeneration/VocabularyStructurer.ts:7](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/VocabularyStructurer.ts#L7)
