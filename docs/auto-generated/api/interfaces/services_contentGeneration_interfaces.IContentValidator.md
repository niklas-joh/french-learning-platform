[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IContentValidator

# Interface: IContentValidator

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IContentValidator

Interface for content validation services
Uses Strategy Pattern for different content types

## Implemented by

- [`BaseValidator`](../classes/services_contentGeneration_validators_BaseValidator.BaseValidator.md)
- [`ContentValidator`](../classes/services_ai_ContentValidator.ContentValidator.md)

## Table of contents

### Methods

- [validate](services_contentGeneration_interfaces.IContentValidator.md#validate)

## Methods

### validate

▸ **validate**(`content`, `request`): `Promise`\<[`ContentValidation`](types_Content.ContentValidation.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `any` |
| `request` | [`ContentRequest`](types_Content.ContentRequest.md) |

#### Returns

`Promise`\<[`ContentValidation`](types_Content.ContentValidation.md)\>

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:40](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L40)
