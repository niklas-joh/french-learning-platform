[server](../README.md) / [Exports](../modules.md) / [controllers/learningPathController](../modules/controllers_learningPathController.md) / LearningPathController

# Class: LearningPathController

[controllers/learningPathController](../modules/controllers_learningPathController.md).LearningPathController

**`Controller`**

LearningPathController
Handles requests related to learning paths.

## Table of contents

### Constructors

- [constructor](controllers_learningPathController.LearningPathController.md#constructor)

### Methods

- [completeLesson](controllers_learningPathController.LearningPathController.md#completelesson)
- [getLearningPathForUser](controllers_learningPathController.LearningPathController.md#getlearningpathforuser)
- [startLesson](controllers_learningPathController.LearningPathController.md#startlesson)

## Constructors

### constructor

• **new LearningPathController**(): [`LearningPathController`](controllers_learningPathController.LearningPathController.md)

#### Returns

[`LearningPathController`](controllers_learningPathController.LearningPathController.md)

## Methods

### completeLesson

▸ **completeLesson**(`req`, `res`, `next`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`\<`void`\>

**`Handler`**

POST /api/user/lessons/:lessonId/complete
Marks a lesson as 'completed' for the user within a transaction.

#### Defined in

[server/src/controllers/learningPathController.ts:85](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/learningPathController.ts#L85)

___

### getLearningPathForUser

▸ **getLearningPathForUser**(`req`, `res`, `next`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) | Express request object, expected to be an AuthenticatedRequest. |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> | Express response object. |
| `next` | `NextFunction` | Express next middleware function. |

#### Returns

`Promise`\<`void`\>

**`Handler`**

GET /api/learning-paths/:pathId/user-view
Retrieves a specific learning path with user progress for the authenticated user.

#### Defined in

[server/src/controllers/learningPathController.ts:18](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/learningPathController.ts#L18)

___

### startLesson

▸ **startLesson**(`req`, `res`, `next`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`Promise`\<`void`\>

**`Handler`**

POST /api/user/lessons/:lessonId/start
Marks a lesson as 'in_progress' for the user.

#### Defined in

[server/src/controllers/learningPathController.ts:54](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/learningPathController.ts#L54)
