[server](../README.md) / [Exports](../modules.md) / models/UserProgress

# Module: models/UserProgress

## Table of contents

### Interfaces

- [AssignedContentProgress](../interfaces/models_UserProgress.AssignedContentProgress.md)
- [LevelThreshold](../interfaces/models_UserProgress.LevelThreshold.md)
- [TopicProgress](../interfaces/models_UserProgress.TopicProgress.md)
- [UserProgress](../interfaces/models_UserProgress.UserProgress.md)

### Type Aliases

- [CEFRLevel](models_UserProgress.md#cefrlevel)

### Variables

- [LEVEL\_THRESHOLDS](models_UserProgress.md#level_thresholds)

### Functions

- [getAssignedContentProgress](models_UserProgress.md#getassignedcontentprogress)
- [getTopicProgress](models_UserProgress.md#gettopicprogress)

## Type Aliases

### CEFRLevel

Ƭ **CEFRLevel**: ``"A1"`` \| ``"A2"`` \| ``"B1"`` \| ``"B2"`` \| ``"C1"`` \| ``"C2"``

#### Defined in

[server/src/models/UserProgress.ts:19](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/UserProgress.ts#L19)

## Variables

### LEVEL\_THRESHOLDS

• `Const` **LEVEL\_THRESHOLDS**: [`LevelThreshold`](../interfaces/models_UserProgress.LevelThreshold.md)[]

#### Defined in

[server/src/models/UserProgress.ts:26](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/UserProgress.ts#L26)

## Functions

### getAssignedContentProgress

▸ **getAssignedContentProgress**(`userId`): `Promise`\<[`AssignedContentProgress`](../interfaces/models_UserProgress.AssignedContentProgress.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |

#### Returns

`Promise`\<[`AssignedContentProgress`](../interfaces/models_UserProgress.AssignedContentProgress.md)\>

#### Defined in

[server/src/models/UserProgress.ts:79](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/UserProgress.ts#L79)

___

### getTopicProgress

▸ **getTopicProgress**(`userId`): `Promise`\<[`TopicProgress`](../interfaces/models_UserProgress.TopicProgress.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |

#### Returns

`Promise`\<[`TopicProgress`](../interfaces/models_UserProgress.TopicProgress.md)[]\>

#### Defined in

[server/src/models/UserProgress.ts:49](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/UserProgress.ts#L49)
