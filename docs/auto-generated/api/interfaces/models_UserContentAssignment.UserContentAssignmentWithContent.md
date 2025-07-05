[server](../README.md) / [Exports](../modules.md) / [models/UserContentAssignment](../modules/models_UserContentAssignment.md) / UserContentAssignmentWithContent

# Interface: UserContentAssignmentWithContent

[models/UserContentAssignment](../modules/models_UserContentAssignment.md).UserContentAssignmentWithContent

## Hierarchy

- [`UserContentAssignment`](models_UserContentAssignment.UserContentAssignment.md)

  ↳ **`UserContentAssignmentWithContent`**

## Table of contents

### Properties

- [assignedAt](models_UserContentAssignment.UserContentAssignmentWithContent.md#assignedat)
- [content](models_UserContentAssignment.UserContentAssignmentWithContent.md#content)
- [contentId](models_UserContentAssignment.UserContentAssignmentWithContent.md#contentid)
- [dueDate](models_UserContentAssignment.UserContentAssignmentWithContent.md#duedate)
- [id](models_UserContentAssignment.UserContentAssignmentWithContent.md#id)
- [status](models_UserContentAssignment.UserContentAssignmentWithContent.md#status)
- [userId](models_UserContentAssignment.UserContentAssignmentWithContent.md#userid)

## Properties

### assignedAt

• **assignedAt**: `Date`

#### Inherited from

[UserContentAssignment](models_UserContentAssignment.UserContentAssignment.md).[assignedAt](models_UserContentAssignment.UserContentAssignment.md#assignedat)

#### Defined in

[server/src/models/UserContentAssignment.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/UserContentAssignment.ts#L12)

___

### content

• **content**: `Partial`\<[`ContentSchema`](models_Content.ContentSchema.md)\> & \{ `type`: `string`  }

#### Defined in

[server/src/models/UserContentAssignment.ts:18](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/UserContentAssignment.ts#L18)

___

### contentId

• **contentId**: `number`

#### Inherited from

[UserContentAssignment](models_UserContentAssignment.UserContentAssignment.md).[contentId](models_UserContentAssignment.UserContentAssignment.md#contentid)

#### Defined in

[server/src/models/UserContentAssignment.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/UserContentAssignment.ts#L11)

___

### dueDate

• `Optional` **dueDate**: `Date`

#### Inherited from

[UserContentAssignment](models_UserContentAssignment.UserContentAssignment.md).[dueDate](models_UserContentAssignment.UserContentAssignment.md#duedate)

#### Defined in

[server/src/models/UserContentAssignment.ts:13](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/UserContentAssignment.ts#L13)

___

### id

• **id**: `number`

#### Inherited from

[UserContentAssignment](models_UserContentAssignment.UserContentAssignment.md).[id](models_UserContentAssignment.UserContentAssignment.md#id)

#### Defined in

[server/src/models/UserContentAssignment.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/UserContentAssignment.ts#L9)

___

### status

• **status**: ``"pending"`` \| ``"in-progress"`` \| ``"completed"`` \| ``"overdue"``

#### Inherited from

[UserContentAssignment](models_UserContentAssignment.UserContentAssignment.md).[status](models_UserContentAssignment.UserContentAssignment.md#status)

#### Defined in

[server/src/models/UserContentAssignment.ts:14](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/UserContentAssignment.ts#L14)

___

### userId

• **userId**: `number`

#### Inherited from

[UserContentAssignment](models_UserContentAssignment.UserContentAssignment.md).[userId](models_UserContentAssignment.UserContentAssignment.md#userid)

#### Defined in

[server/src/models/UserContentAssignment.ts:10](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/UserContentAssignment.ts#L10)
