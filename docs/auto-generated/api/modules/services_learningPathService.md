[server](../README.md) / [Exports](../modules.md) / services/learningPathService

# Module: services/learningPathService

## Table of contents

### Functions

- [completeUserLesson](services_learningPathService.md#completeuserlesson)
- [getLearningPathUserView](services_learningPathService.md#getlearningpathuserview)
- [startUserLesson](services_learningPathService.md#startuserlesson)

## Functions

### completeUserLesson

▸ **completeUserLesson**(`userId`, `lessonId`, `trx`): `Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)\>

Completes a lesson for a user within a database transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `number` | The ID of the user. |
| `lessonId` | `number` | The ID of the lesson to complete. |
| `trx` | `Transaction`\<`any`, `any`[]\> | The Knex transaction object. |

#### Returns

`Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)\>

The updated user lesson progress record.

**`Throws`**

An error if the lesson progress does not exist or is not 'in_progress'.

#### Defined in

[server/src/services/learningPathService.ts:155](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/learningPathService.ts#L155)

___

### getLearningPathUserView

▸ **getLearningPathUserView**(`pathId`, `userId`): `Promise`\<[`LearningPathWithUserProgress`](../interfaces/models_LearningPath.LearningPathWithUserProgress.md) \| ``null``\>

Retrieves a learning path with its units and lessons, including user-specific progress
for each lesson.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pathId` | `number` | The ID of the learning path to retrieve. |
| `userId` | `number` | The ID of the user for whom to retrieve progress. |

#### Returns

`Promise`\<[`LearningPathWithUserProgress`](../interfaces/models_LearningPath.LearningPathWithUserProgress.md) \| ``null``\>

A Promise resolving to LearningPathWithUserProgress object or null if not found.

#### Defined in

[server/src/services/learningPathService.ts:14](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/learningPathService.ts#L14)

___

### startUserLesson

▸ **startUserLesson**(`userId`, `lessonId`): `Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)\>

Starts a lesson for a user by creating or updating their progress record.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `number` | The ID of the user. |
| `lessonId` | `number` | The ID of the lesson to start. |

#### Returns

`Promise`\<[`UserLessonProgress`](../interfaces/models_UserLessonProgress.UserLessonProgress.md)\>

The created or updated user lesson progress record.

#### Defined in

[server/src/services/learningPathService.ts:135](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/learningPathService.ts#L135)
