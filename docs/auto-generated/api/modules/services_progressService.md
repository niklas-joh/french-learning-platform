[server](../README.md) / [Exports](../modules.md) / services/progressService

# Module: services/progressService

## Table of contents

### Classes

- [ProgressService](../classes/services_progressService.ProgressService.md)

### Variables

- [progressService](services_progressService.md#progressservice)

### Functions

- [getUserProgress](services_progressService.md#getuserprogress)
- [getUserStreak](services_progressService.md#getuserstreak)
- [recordActivity](services_progressService.md#recordactivity)

## Variables

### progressService

• `Const` **progressService**: [`ProgressService`](../classes/services_progressService.ProgressService.md)

#### Defined in

[server/src/services/progressService.ts:98](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/progressService.ts#L98)

## Functions

### getUserProgress

▸ **getUserProgress**(`userId`): `Promise`\<`undefined` \| [`UserProgress`](../interfaces/models_UserProgress.UserProgress.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |

#### Returns

`Promise`\<`undefined` \| [`UserProgress`](../interfaces/models_UserProgress.UserProgress.md)\>

#### Defined in

[server/src/services/progressService.ts:22](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/progressService.ts#L22)

___

### getUserStreak

▸ **getUserStreak**(`userId`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |

#### Returns

`Promise`\<`number`\>

#### Defined in

[server/src/services/progressService.ts:26](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/progressService.ts#L26)

___

### recordActivity

▸ **recordActivity**(`userId`, `activityData`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |
| `activityData` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[server/src/services/progressService.ts:32](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/progressService.ts#L32)
