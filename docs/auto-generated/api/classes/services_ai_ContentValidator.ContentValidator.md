[server](../README.md) / [Exports](../modules.md) / [services/ai/ContentValidator](../modules/services_ai_ContentValidator.md) / ContentValidator

# Class: ContentValidator

[services/ai/ContentValidator](../modules/services_ai_ContentValidator.md).ContentValidator

Interface for content validation services
Uses Strategy Pattern for different content types

## Implements

- [`IContentValidator`](../interfaces/services_contentGeneration_interfaces.IContentValidator.md)

## Table of contents

### Constructors

- [constructor](services_ai_ContentValidator.ContentValidator.md#constructor)

### Properties

- [commonRules](services_ai_ContentValidator.ContentValidator.md#commonrules)
- [validationRules](services_ai_ContentValidator.ContentValidator.md#validationrules)

### Methods

- [assessContentCompleteness](services_ai_ContentValidator.ContentValidator.md#assesscontentcompleteness)
- [calculateValidationConfidence](services_ai_ContentValidator.ContentValidator.md#calculatevalidationconfidence)
- [checkContentSafety](services_ai_ContentValidator.ContentValidator.md#checkcontentsafety)
- [createFailedValidation](services_ai_ContentValidator.ContentValidator.md#createfailedvalidation)
- [extractTextContent](services_ai_ContentValidator.ContentValidator.md#extracttextcontent)
- [hasValidStructure](services_ai_ContentValidator.ContentValidator.md#hasvalidstructure)
- [initializeCommonRules](services_ai_ContentValidator.ContentValidator.md#initializecommonrules)
- [initializeContentTypeRules](services_ai_ContentValidator.ContentValidator.md#initializecontenttyperules)
- [isAppropriateForLevel](services_ai_ContentValidator.ContentValidator.md#isappropriateforlevel)
- [isVagueLearningObjective](services_ai_ContentValidator.ContentValidator.md#isvaguelearningobjective)
- [validate](services_ai_ContentValidator.ContentValidator.md#validate)
- [validateFrenchContent](services_ai_ContentValidator.ContentValidator.md#validatefrenchcontent)

## Constructors

### constructor

• **new ContentValidator**(): [`ContentValidator`](services_ai_ContentValidator.ContentValidator.md)

#### Returns

[`ContentValidator`](services_ai_ContentValidator.ContentValidator.md)

#### Defined in

[server/src/services/ai/ContentValidator.ts:46](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L46)

## Properties

### commonRules

• `Private` `Readonly` **commonRules**: `ValidationRule`[]

#### Defined in

[server/src/services/ai/ContentValidator.ts:44](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L44)

___

### validationRules

• `Private` `Readonly` **validationRules**: `Map`\<[`ContentType`](../modules/types_Content.md#contenttype), `ValidationRule`[]\>

#### Defined in

[server/src/services/ai/ContentValidator.ts:43](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L43)

## Methods

### assessContentCompleteness

▸ **assessContentCompleteness**(`content`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](../modules/types_Content.md#structuredcontent) |

#### Returns

`number`

#### Defined in

[server/src/services/ai/ContentValidator.ts:544](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L544)

___

### calculateValidationConfidence

▸ **calculateValidationConfidence**(`results`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `results` | \{ `result`: `ValidationResult` ; `rule`: `ValidationRule`  }[] |

#### Returns

`number`

#### Defined in

[server/src/services/ai/ContentValidator.ts:584](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L584)

___

### checkContentSafety

▸ **checkContentSafety**(`text`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `isSafe` | `boolean` |

#### Defined in

[server/src/services/ai/ContentValidator.ts:572](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L572)

___

### createFailedValidation

▸ **createFailedValidation**(`message`, `issues`): [`ContentValidation`](../interfaces/types_Content.ContentValidation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `issues` | `string`[] |

#### Returns

[`ContentValidation`](../interfaces/types_Content.ContentValidation.md)

#### Defined in

[server/src/services/ai/ContentValidator.ts:593](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L593)

___

### extractTextContent

▸ **extractTextContent**(`content`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](../modules/types_Content.md#structuredcontent) |

#### Returns

`string`

#### Defined in

[server/src/services/ai/ContentValidator.ts:486](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L486)

___

### hasValidStructure

▸ **hasValidStructure**(`content`): content is StructuredContent

Helper methods for validation checks

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `any` |

#### Returns

content is StructuredContent

#### Defined in

[server/src/services/ai/ContentValidator.ts:477](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L477)

___

### initializeCommonRules

▸ **initializeCommonRules**(): `ValidationRule`[]

Initialize common validation rules that apply to all content types

#### Returns

`ValidationRule`[]

#### Defined in

[server/src/services/ai/ContentValidator.ts:116](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L116)

___

### initializeContentTypeRules

▸ **initializeContentTypeRules**(): `Map`\<[`ContentType`](../modules/types_Content.md#contenttype), `ValidationRule`[]\>

Initialize content-type-specific validation rules

#### Returns

`Map`\<[`ContentType`](../modules/types_Content.md#contenttype), `ValidationRule`[]\>

#### Defined in

[server/src/services/ai/ContentValidator.ts:262](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L262)

___

### isAppropriateForLevel

▸ **isAppropriateForLevel**(`content`, `level`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | [`StructuredContent`](../modules/types_Content.md#structuredcontent) |
| `level` | `string` |

#### Returns

`boolean`

#### Defined in

[server/src/services/ai/ContentValidator.ts:519](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L519)

___

### isVagueLearningObjective

▸ **isVagueLearningObjective**(`objective`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `objective` | `string` |

#### Returns

`boolean`

#### Defined in

[server/src/services/ai/ContentValidator.ts:539](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L539)

___

### validate

▸ **validate**(`content`, `request`): `Promise`\<[`ContentValidation`](../interfaces/types_Content.ContentValidation.md)\>

Main validation method that orchestrates all validation checks

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `any` |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |

#### Returns

`Promise`\<[`ContentValidation`](../interfaces/types_Content.ContentValidation.md)\>

#### Implementation of

[IContentValidator](../interfaces/services_contentGeneration_interfaces.IContentValidator.md).[validate](../interfaces/services_contentGeneration_interfaces.IContentValidator.md#validate)

#### Defined in

[server/src/services/ai/ContentValidator.ts:54](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L54)

___

### validateFrenchContent

▸ **validateFrenchContent**(`text`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `issues` | `string`[] |
| `suggestions` | `string`[] |

#### Defined in

[server/src/services/ai/ContentValidator.ts:498](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/ContentValidator.ts#L498)
