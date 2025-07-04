[server](../README.md) / [Exports](../modules.md) / models/UserLessonProgress

# Module: models/UserLessonProgress

## Table of contents

### Interfaces

- [UserLessonProgress](../interfaces/models_UserLessonProgress.UserLessonProgress.md)

### Type Aliases

- [LessonStatus](models_UserLessonProgress.md#lessonstatus)

### Functions

- [completeLesson](models_UserLessonProgress.md#completelesson)
- [getLessonProgressForUser](models_UserLessonProgress.md#getlessonprogressforuser)
- [startLesson](models_UserLessonProgress.md#startlesson)

## Type Aliases

### LessonStatus

Ƭ **LessonStatus**: ``"locked"`` \| ``"available"`` \| ``"in-progress"`` \| ``"completed"``

#### Defined in

[server/src/models/UserLessonProgress.ts:5](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/UserLessonProgress.ts#L5)

## Functions

### completeLesson

▸ **completeLesson**(`userId`, `lessonId`, `trx`): `Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |
| `lessonId` | `number` |
| `trx` | `Transaction`\<`any`, `any`[]\> |

#### Returns

`Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)\>

#### Defined in

[server/src/models/UserLessonProgress.ts:58](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/UserLessonProgress.ts#L58)

___

### getLessonProgressForUser

▸ **getLessonProgressForUser**(`userId`, `lessonIds`): `Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |
| `lessonIds` | `number`[] |

#### Returns

`Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)[]\>

#### Defined in

[server/src/models/UserLessonProgress.ts:21](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/UserLessonProgress.ts#L21)

___

### startLesson

▸ **startLesson**(`userId`, `lessonId`): `Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |
| `lessonId` | `number` |

#### Returns

`Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)\>

#### Defined in

[server/src/models/UserLessonProgress.ts:30](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/UserLessonProgress.ts#L30)
