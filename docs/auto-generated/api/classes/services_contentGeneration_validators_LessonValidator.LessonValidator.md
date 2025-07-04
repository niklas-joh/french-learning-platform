[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/validators/LessonValidator](../modules/services_contentGeneration_validators_LessonValidator.md) / LessonValidator

# Class: LessonValidator

[services/contentGeneration/validators/LessonValidator](../modules/services_contentGeneration_validators_LessonValidator.md).LessonValidator

Concrete validator for Lesson content.

## Hierarchy

- [`BaseValidator`](services_contentGeneration_validators_BaseValidator.BaseValidator.md)

  ↳ **`LessonValidator`**

## Table of contents

### Constructors

- [constructor](services_contentGeneration_validators_LessonValidator.LessonValidator.md#constructor)

### Properties

- [contentType](services_contentGeneration_validators_LessonValidator.LessonValidator.md#contenttype)
- [logger](services_contentGeneration_validators_LessonValidator.LessonValidator.md#logger)

### Methods

- [checkArrayNonEmpty](services_contentGeneration_validators_LessonValidator.LessonValidator.md#checkarraynonempty)
- [checkNonEmpty](services_contentGeneration_validators_LessonValidator.LessonValidator.md#checknonempty)
- [validate](services_contentGeneration_validators_LessonValidator.LessonValidator.md#validate)

## Constructors

### constructor

• **new LessonValidator**(`logger`): [`LessonValidator`](services_contentGeneration_validators_LessonValidator.LessonValidator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`LessonValidator`](services_contentGeneration_validators_LessonValidator.LessonValidator.md)

#### Overrides

[BaseValidator](services_contentGeneration_validators_BaseValidator.BaseValidator.md).[constructor](services_contentGeneration_validators_BaseValidator.BaseValidator.md#constructor)

#### Defined in

[server/src/services/contentGeneration/validators/LessonValidator.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/LessonValidator.ts#L11)

## Properties

### contentType

• `Protected` `Readonly` **contentType**: [`ContentType`](../modules/types_Content.md#contenttype) = `'lesson'`

#### Overrides

[BaseValidator](services_contentGeneration_validators_BaseValidator.BaseValidator.md).[contentType](services_contentGeneration_validators_BaseValidator.BaseValidator.md#contenttype)

#### Defined in

[server/src/services/contentGeneration/validators/LessonValidator.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/LessonValidator.ts#L9)

___

### logger

• `Protected` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Inherited from

[BaseValidator](services_contentGeneration_validators_BaseValidator.BaseValidator.md).[logger](services_contentGeneration_validators_BaseValidator.BaseValidator.md#logger)

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

#### Inherited from

[BaseValidator](services_contentGeneration_validators_BaseValidator.BaseValidator.md).[checkArrayNonEmpty](services_contentGeneration_validators_BaseValidator.BaseValidator.md#checkarraynonempty)

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

#### Inherited from

[BaseValidator](services_contentGeneration_validators_BaseValidator.BaseValidator.md).[checkNonEmpty](services_contentGeneration_validators_BaseValidator.BaseValidator.md#checknonempty)

#### Defined in

[server/src/services/contentGeneration/validators/BaseValidator.ts:29](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/BaseValidator.ts#L29)

___

### validate

▸ **validate**(`content`, `request`): `Promise`\<[`ContentValidation`](../interfaces/types_Content.ContentValidation.md)\>

Validates the structure and content of a lesson.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | [`IStructuredLesson`](../interfaces/types_Content.IStructuredLesson.md) | The lesson content to validate. |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) | The original content generation request. |

#### Returns

`Promise`\<[`ContentValidation`](../interfaces/types_Content.ContentValidation.md)\>

A promise that resolves to a ContentValidation object.

#### Overrides

[BaseValidator](services_contentGeneration_validators_BaseValidator.BaseValidator.md).[validate](services_contentGeneration_validators_BaseValidator.BaseValidator.md#validate)

#### Defined in

[server/src/services/contentGeneration/validators/LessonValidator.ts:21](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/validators/LessonValidator.ts#L21)
