[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/validators/BaseValidator](../modules/services_contentGeneration_validators_BaseValidator.md) / BaseValidator

# Class: BaseValidator

[services/contentGeneration/validators/BaseValidator](../modules/services_contentGeneration_validators_BaseValidator.md).BaseValidator

Abstract base class for content validators.
Provides common utility methods and a consistent structure for all validator implementations.

## Hierarchy

- **`BaseValidator`**

  ↳ [`ExerciseValidator`](services_contentGeneration_validators_ExerciseValidator.ExerciseValidator.md)

  ↳ [`LessonValidator`](services_contentGeneration_validators_LessonValidator.LessonValidator.md)

  ↳ [`VocabularyValidator`](services_contentGeneration_validators_VocabularyValidator.VocabularyValidator.md)

## Implements

- [`IContentValidator`](../interfaces/services_contentGeneration_interfaces.IContentValidator.md)

## Table of contents

### Constructors

- [constructor](services_contentGeneration_validators_BaseValidator.BaseValidator.md#constructor)

### Properties

- [contentType](services_contentGeneration_validators_BaseValidator.BaseValidator.md#contenttype)
- [logger](services_contentGeneration_validators_BaseValidator.BaseValidator.md#logger)

### Methods

- [checkArrayNonEmpty](services_contentGeneration_validators_BaseValidator.BaseValidator.md#checkarraynonempty)
- [checkNonEmpty](services_contentGeneration_validators_BaseValidator.BaseValidator.md#checknonempty)
- [validate](services_contentGeneration_validators_BaseValidator.BaseValidator.md#validate)

## Constructors

### constructor

• **new BaseValidator**(`logger`): [`BaseValidator`](services_contentGeneration_validators_BaseValidator.BaseValidator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`BaseValidator`](services_contentGeneration_validators_BaseValidator.BaseValidator.md)

#### Defined in

[server/src/services/contentGeneration/validators/BaseValidator.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/BaseValidator.ts#L12)

## Properties

### contentType

• `Protected` `Readonly` `Abstract` **contentType**: [`ContentType`](../modules/types_Content.md#contenttype)

#### Defined in

[server/src/services/contentGeneration/validators/BaseValidator.ts:10](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/BaseValidator.ts#L10)

___

### logger

• `Protected` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Defined in

[server/src/services/contentGeneration/validators/BaseValidator.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/BaseValidator.ts#L12)

## Methods

### checkArrayNonEmpty

▸ **checkArrayNonEmpty**(`fieldName`, `value`, `issues`, `minLength?`): `void`

Checks if an array is null, undefined, or empty.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `fieldName` | `string` | `undefined` | The name of the field being checked. |
| `value` | `any`[] | `undefined` | The array to check. |
| `issues` | `string`[] | `undefined` | The array of validation issues to append to if the check fails. |
| `minLength` | `number` | `1` | The minimum required length for the array. |

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/validators/BaseValidator.ts:44](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/BaseValidator.ts#L44)

___

### checkNonEmpty

▸ **checkNonEmpty**(`fieldName`, `value`, `issues`, `minLength?`): `void`

Checks if a given string value is null, undefined, or empty.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `fieldName` | `string` | `undefined` | The name of the field being checked (for logging purposes). |
| `value` | `any` | `undefined` | The string value to check. |
| `issues` | `string`[] | `undefined` | The array of validation issues to append to if the check fails. |
| `minLength` | `number` | `1` | The minimum required length for the string. |

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/validators/BaseValidator.ts:29](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/BaseValidator.ts#L29)

___

### validate

▸ **validate**(`content`, `request`): `Promise`\<[`ContentValidation`](../interfaces/types_Content.ContentValidation.md)\>

Abstract method to be implemented by concrete validator classes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | `any` | The content to validate, specific to the content type. |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) | The original content generation request. |

#### Returns

`Promise`\<[`ContentValidation`](../interfaces/types_Content.ContentValidation.md)\>

A promise that resolves to a ContentValidation object.

#### Implementation of

[IContentValidator](../interfaces/services_contentGeneration_interfaces.IContentValidator.md).[validate](../interfaces/services_contentGeneration_interfaces.IContentValidator.md#validate)

#### Defined in

[server/src/services/contentGeneration/validators/BaseValidator.ts:20](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/BaseValidator.ts#L20)
