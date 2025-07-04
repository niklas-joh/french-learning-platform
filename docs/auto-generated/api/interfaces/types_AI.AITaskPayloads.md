[server](../README.md) / [Exports](../modules.md) / [types/AI](../modules/types_AI.md) / AITaskPayloads

# Interface: AITaskPayloads

[types/AI](../modules/types_AI.md).AITaskPayloads

**`Description`**

Central registry of all AI tasks and their associated request/response payload types.
             This creates a single source of truth and enables powerful type inference,
             preventing payload mismatches and reducing developer errors.

## Table of contents

### Properties

- [ASSESS\_PRONUNCIATION](types_AI.AITaskPayloads.md#assess_pronunciation)
- [CONVERSATIONAL\_TUTOR\_RESPONSE](types_AI.AITaskPayloads.md#conversational_tutor_response)
- [GENERATE\_CURRICULUM\_PATH](types_AI.AITaskPayloads.md#generate_curriculum_path)
- [GENERATE\_LESSON](types_AI.AITaskPayloads.md#generate_lesson)
- [GRADE\_RESPONSE](types_AI.AITaskPayloads.md#grade_response)

## Properties

### ASSESS\_PRONUNCIATION

• **ASSESS\_PRONUNCIATION**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | \{ `audioUrl`: `string` ; `expectedPhrase`: `string`  } |
| `request.audioUrl` | `string` |
| `request.expectedPhrase` | `string` |
| `response` | \{ `feedback`: `string` ; `improvements?`: `string`[] ; `score`: `number`  } |
| `response.feedback` | `string` |
| `response.improvements?` | `string`[] |
| `response.score` | `number` |

#### Defined in

[server/src/types/AI.ts:142](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L142)

___

### CONVERSATIONAL\_TUTOR\_RESPONSE

• **CONVERSATIONAL\_TUTOR\_RESPONSE**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | \{ `conversationHistory?`: `any`[] ; `message`: `string`  } |
| `request.conversationHistory?` | `any`[] |
| `request.message` | `string` |
| `response` | \{ `response`: `string` ; `suggestions?`: `string`[]  } |
| `response.response` | `string` |
| `response.suggestions?` | `string`[] |

#### Defined in

[server/src/types/AI.ts:195](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L195)

___

### GENERATE\_CURRICULUM\_PATH

• **GENERATE\_CURRICULUM\_PATH**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | \{ `currentLevel`: `string` ; `goals`: `string`[]  } |
| `request.currentLevel` | `string` |
| `request.goals` | `string`[] |
| `response` | \{ `path`: `any`[]  } |
| `response.path` | `any`[] |

#### Defined in

[server/src/types/AI.ts:181](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L181)

___

### GENERATE\_LESSON

• **GENERATE\_LESSON**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime?`: `number` ; `topic`: `string`  } |
| `request.difficulty` | ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` |
| `request.estimatedTime?` | `number` |
| `request.topic` | `string` |
| `response` | [`Lesson`](models_Lesson.Lesson.md) |

#### Defined in

[server/src/types/AI.ts:130](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L130)

___

### GRADE\_RESPONSE

• **GRADE\_RESPONSE**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | \{ `correctAnswer`: `string` ; `questionType`: ``"multiple_choice"`` \| ``"fill_blank"`` \| ``"translation"`` \| ``"essay"`` ; `userResponse`: `string`  } |
| `request.correctAnswer` | `string` |
| `request.questionType` | ``"multiple_choice"`` \| ``"fill_blank"`` \| ``"translation"`` \| ``"essay"`` |
| `request.userResponse` | `string` |
| `response` | \{ `feedback`: `string` ; `isCorrect`: `boolean` ; `score`: `number` ; `suggestions?`: `string`[]  } |
| `response.feedback` | `string` |
| `response.isCorrect` | `boolean` |
| `response.score` | `number` |
| `response.suggestions?` | `string`[] |

#### Defined in

[server/src/types/AI.ts:159](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L159)
