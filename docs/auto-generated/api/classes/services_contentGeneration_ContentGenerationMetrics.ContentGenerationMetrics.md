[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/ContentGenerationMetrics](../modules/services_contentGeneration_ContentGenerationMetrics.md) / ContentGenerationMetrics

# Class: ContentGenerationMetrics

[services/contentGeneration/ContentGenerationMetrics](../modules/services_contentGeneration_ContentGenerationMetrics.md).ContentGenerationMetrics

Interface for content generation metrics and monitoring
TODO: Reference Future Implementation #24 - Implement Structured Logging

## Implements

- [`IContentGenerationMetrics`](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md)

## Table of contents

### Constructors

- [constructor](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md#constructor)

### Properties

- [logger](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md#logger)

### Methods

- [log](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md#log)
- [recordFallbackUsed](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md#recordfallbackused)
- [recordGenerationAttempt](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md#recordgenerationattempt)
- [recordGenerationFailure](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md#recordgenerationfailure)
- [recordGenerationSuccess](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md#recordgenerationsuccess)
- [recordValidationFailure](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md#recordvalidationfailure)

## Constructors

### constructor

• **new ContentGenerationMetrics**(`logger`): [`ContentGenerationMetrics`](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`ContentGenerationMetrics`](services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationMetrics.ts:6](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationMetrics.ts#L6)

## Properties

### logger

• `Private` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationMetrics.ts:6](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationMetrics.ts#L6)

## Methods

### log

▸ **log**(`level`, `event`, `data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `level` | ``"error"`` \| ``"info"`` \| ``"warn"`` |
| `event` | `string` |
| `data` | `Record`\<`string`, `any`\> |

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/ContentGenerationMetrics.ts:8](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationMetrics.ts#L8)

___

### recordFallbackUsed

▸ **recordFallbackUsed**(`request`, `error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |
| `error` | `Error` |

#### Returns

`void`

#### Implementation of

[IContentGenerationMetrics](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md).[recordFallbackUsed](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordfallbackused)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationMetrics.ts:54](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationMetrics.ts#L54)

___

### recordGenerationAttempt

▸ **recordGenerationAttempt**(`request`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |

#### Returns

`void`

#### Implementation of

[IContentGenerationMetrics](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md).[recordGenerationAttempt](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordgenerationattempt)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationMetrics.ts:17](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationMetrics.ts#L17)

___

### recordGenerationFailure

▸ **recordGenerationFailure**(`request`, `duration`, `error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |
| `duration` | `number` |
| `error` | `Error` |

#### Returns

`void`

#### Implementation of

[IContentGenerationMetrics](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md).[recordGenerationFailure](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordgenerationfailure)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationMetrics.ts:35](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationMetrics.ts#L35)

___

### recordGenerationSuccess

▸ **recordGenerationSuccess**(`request`, `duration`, `validationScore`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |
| `duration` | `number` |
| `validationScore` | `number` |

#### Returns

`void`

#### Implementation of

[IContentGenerationMetrics](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md).[recordGenerationSuccess](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordgenerationsuccess)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationMetrics.ts:26](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationMetrics.ts#L26)

___

### recordValidationFailure

▸ **recordValidationFailure**(`request`, `validation`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) |
| `validation` | [`ContentValidation`](../interfaces/types_Content.ContentValidation.md) |

#### Returns

`void`

#### Implementation of

[IContentGenerationMetrics](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md).[recordValidationFailure](../interfaces/services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordvalidationfailure)

#### Defined in

[server/src/services/contentGeneration/ContentGenerationMetrics.ts:45](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/ContentGenerationMetrics.ts#L45)
