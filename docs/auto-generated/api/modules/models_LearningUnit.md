[server](../README.md) / [Exports](../modules.md) / models/LearningUnit

# Module: models/LearningUnit

## Table of contents

### Interfaces

- [LearningUnit](../interfaces/models_LearningUnit.LearningUnit.md)
- [LearningUnitWithUserProgress](../interfaces/models_LearningUnit.LearningUnitWithUserProgress.md)

### Type Aliases

- [UnitAndLessonRow](models_LearningUnit.md#unitandlessonrow)

### Functions

- [getUnitsAndLessonsByPathId](models_LearningUnit.md#getunitsandlessonsbypathid)

## Type Aliases

### UnitAndLessonRow

Ƭ **UnitAndLessonRow**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `lessonContentData?` | `string` |
| `lessonCreatedAt` | `string` |
| `lessonDescription?` | `string` |
| `lessonEstimatedTime` | `number` |
| `lessonId` | `number` |
| `lessonIsActive` | `boolean` |
| `lessonOrderIndex` | `number` |
| `lessonTitle` | `string` |
| `lessonType` | `string` |
| `lessonUpdatedAt` | `string` |
| `unitCreatedAt` | `string` |
| `unitDescription?` | `string` |
| `unitId` | `number` |
| `unitIsActive` | `boolean` |
| `unitLevel` | `string` |
| `unitOrderIndex` | `number` |
| `unitTitle` | `string` |
| `unitUpdatedAt` | `string` |

#### Defined in

[server/src/models/LearningUnit.ts:22](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/LearningUnit.ts#L22)

## Functions

### getUnitsAndLessonsByPathId

▸ **getUnitsAndLessonsByPathId**(`pathId`): `Promise`\<[`UnitAndLessonRow`](models_LearningUnit.md#unitandlessonrow)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathId` | `number` |

#### Returns

`Promise`\<[`UnitAndLessonRow`](models_LearningUnit.md#unitandlessonrow)[]\>

#### Defined in

[server/src/models/LearningUnit.ts:43](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/LearningUnit.ts#L43)
