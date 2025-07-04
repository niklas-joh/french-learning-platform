[server](../README.md) / [Exports](../modules.md) / models/UserContentAssignment

# Module: models/UserContentAssignment

## Table of contents

### Interfaces

- [UserContentAssignment](../interfaces/models_UserContentAssignment.UserContentAssignment.md)
- [UserContentAssignmentWithContent](../interfaces/models_UserContentAssignment.UserContentAssignmentWithContent.md)

### Variables

- [default](models_UserContentAssignment.md#default)

## Variables

### default

• `Const` **default**: `Object`

CRUD helpers for content assignments.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `assign` | (`userId`: `number`, `contentId`: `number`, `dueDate?`: `Date`) => `Promise`\<[`UserContentAssignment`](../interfaces/models_UserContentAssignment.UserContentAssignment.md)\> |
| `findById` | (`id`: `number`) => `Promise`\<`undefined` \| [`UserContentAssignment`](../interfaces/models_UserContentAssignment.UserContentAssignment.md)\> |
| `findByUserId` | (`userId`: `number`) => `Promise`\<[`UserContentAssignmentWithContent`](../interfaces/models_UserContentAssignment.UserContentAssignmentWithContent.md)[]\> |
| `findByUserIdAndContentId` | (`userId`: `number`, `contentId`: `number`) => `Promise`\<`undefined` \| [`UserContentAssignment`](../interfaces/models_UserContentAssignment.UserContentAssignment.md)\> |
| `unassign` | (`id`: `number`) => `Promise`\<`number`\> |
| `updateStatus` | (`assignmentId`: `number`, `status`: ``"pending"`` \| ``"in-progress"`` \| ``"completed"`` \| ``"overdue"``) => `Promise`\<`undefined` \| [`UserContentAssignment`](../interfaces/models_UserContentAssignment.UserContentAssignment.md)\> |

#### Defined in

[server/src/models/UserContentAssignment.ts:24](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/UserContentAssignment.ts#L24)
