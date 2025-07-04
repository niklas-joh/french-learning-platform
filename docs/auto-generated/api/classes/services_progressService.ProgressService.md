[server](../README.md) / [Exports](../modules.md) / [services/progressService](../modules/services_progressService.md) / ProgressService

# Class: ProgressService

[services/progressService](../modules/services_progressService.md).ProgressService

## Table of contents

### Constructors

- [constructor](services_progressService.ProgressService.md#constructor)

### Methods

- [getUserProgress](services_progressService.ProgressService.md#getuserprogress)
- [initializeUserProgress](services_progressService.ProgressService.md#initializeuserprogress)

## Constructors

### constructor

• **new ProgressService**(): [`ProgressService`](services_progressService.ProgressService.md)

#### Returns

[`ProgressService`](services_progressService.ProgressService.md)

## Methods

### getUserProgress

▸ **getUserProgress**(`userId`): `Promise`\<`undefined` \| [`UserProgress`](../interfaces/models_UserProgress.UserProgress.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |

#### Returns

`Promise`\<`undefined` \| [`UserProgress`](../interfaces/models_UserProgress.UserProgress.md)\>

#### Defined in

[server/src/services/progressService.ts:64](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/progressService.ts#L64)

___

### initializeUserProgress

▸ **initializeUserProgress**(`userId`): `Promise`\<[`UserProgress`](../interfaces/models_UserProgress.UserProgress.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |

#### Returns

`Promise`\<[`UserProgress`](../interfaces/models_UserProgress.UserProgress.md)\>

#### Defined in

[server/src/services/progressService.ts:68](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/progressService.ts#L68)
