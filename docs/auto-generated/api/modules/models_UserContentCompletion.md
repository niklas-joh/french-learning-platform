[server](../README.md) / [Exports](../modules.md) / models/UserContentCompletion

# Module: models/UserContentCompletion

## Table of contents

### Interfaces

- [UserContentCompletion](../interfaces/models_UserContentCompletion.UserContentCompletion.md)

### Variables

- [default](models_UserContentCompletion.md#default)

## Variables

### default

• `Const` **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | (`userId`: `number`, `contentId`: `number`, `explicitAssignmentId?`: `number`, `score?`: `number`, `attemptNumber`: `number`) => `Promise`\<[`UserContentCompletion`](../interfaces/models_UserContentCompletion.UserContentCompletion.md)\> |
| `findByUserAndContent` | (`userId`: `number`, `contentId`: `number`) => `Promise`\<[`UserContentCompletion`](../interfaces/models_UserContentCompletion.UserContentCompletion.md)[]\> |
| `getCompletionsByTopicForUser` | (`userId`: `number`, `topicId`: `number`) => `Promise`\<\{ `contentId`: `number`  }[]\> |

#### Defined in

[server/src/models/UserContentCompletion.ts:15](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/UserContentCompletion.ts#L15)
