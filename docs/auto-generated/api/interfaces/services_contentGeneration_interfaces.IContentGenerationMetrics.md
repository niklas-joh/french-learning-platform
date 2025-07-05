[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IContentGenerationMetrics

# Interface: IContentGenerationMetrics

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IContentGenerationMetrics

Interface for content generation metrics and monitoring
TODO: Reference Future Implementation #24 - Implement Structured Logging

## Implemented by

- [`ContentGenerationMetrics`](../classes/services_contentGeneration_ContentGenerationMetrics.ContentGenerationMetrics.md)

## Table of contents

### Methods

- [recordFallbackUsed](services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordfallbackused)
- [recordGenerationAttempt](services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordgenerationattempt)
- [recordGenerationFailure](services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordgenerationfailure)
- [recordGenerationSuccess](services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordgenerationsuccess)
- [recordValidationFailure](services_contentGeneration_interfaces.IContentGenerationMetrics.md#recordvalidationfailure)

## Methods

### recordFallbackUsed

▸ **recordFallbackUsed**(`request`, `error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](types_Content.ContentRequest.md) |
| `error` | `Error` |

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:150](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L150)

___

### recordGenerationAttempt

▸ **recordGenerationAttempt**(`request`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](types_Content.ContentRequest.md) |

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:146](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L146)

___

### recordGenerationFailure

▸ **recordGenerationFailure**(`request`, `duration`, `error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](types_Content.ContentRequest.md) |
| `duration` | `number` |
| `error` | `Error` |

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:148](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L148)

___

### recordGenerationSuccess

▸ **recordGenerationSuccess**(`request`, `duration`, `validationScore`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](types_Content.ContentRequest.md) |
| `duration` | `number` |
| `validationScore` | `number` |

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:147](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L147)

___

### recordValidationFailure

▸ **recordValidationFailure**(`request`, `validation`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`ContentRequest`](types_Content.ContentRequest.md) |
| `validation` | [`ContentValidation`](types_Content.ContentValidation.md) |

#### Returns

`void`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:149](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L149)
