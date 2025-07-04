[server](../README.md) / [Exports](../modules.md) / controllers/\_\_tests\_\_/mocks

# Module: controllers/\_\_tests\_\_/mocks

## Table of contents

### Variables

- [AIServiceMocks](controllers___tests___mocks.md#aiservicemocks)
- [ExpressMocks](controllers___tests___mocks.md#expressmocks)
- [PerformanceHelpers](controllers___tests___mocks.md#performancehelpers)
- [TestDataFactory](controllers___tests___mocks.md#testdatafactory)
- [TestHelpers](controllers___tests___mocks.md#testhelpers)

## Variables

### AIServiceMocks

• `Const` **AIServiceMocks**: `Object`

AI Service Mock Factory

Provides mock implementations for AI services to isolate API layer testing

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `createMockAIOrchestrator` | (`customResponses`: \{ `assessPronunciation?`: `any` ; `generateLesson?`: `any` ; `gradeResponse?`: `any`  }) => \{ `assessPronunciation`: `Mock`\<`any`, `any`, `any`\> ; `generateLesson`: `Mock`\<`any`, `any`, `any`\> ; `getContextualRecommendations`: `Mock`\<`any`, `any`, `any`\> ; `gradeResponse`: `Mock`\<`any`, `any`, `any`\> ; `recordInteraction`: `Mock`\<`any`, `any`, `any`\>  } | - |
| `createMockServiceFactory` | (`orchestratorMock?`: `any`) => \{ `getAIOrchestrator`: `Mock`\<`any`, `any`, `any`\> ; `getCacheService`: `Mock`\<`any`, `any`, `any`\> ; `getRateLimitService`: `Mock`\<`any`, `any`, `any`\>  } | - |

#### Defined in

[server/src/controllers/__tests__/mocks.ts:181](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/__tests__/mocks.ts#L181)

___

### ExpressMocks

• `Const` **ExpressMocks**: `Object`

Mock Express Request/Response utilities

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `createMockAuthenticatedRequest` | (`overrides`: `Partial`\<`AuthenticatedRequest`\>) => `Partial`\<`AuthenticatedRequest`\> | - |
| `createMockResponse` | () => `Partial`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\> | - |

#### Defined in

[server/src/controllers/__tests__/mocks.ts:141](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/__tests__/mocks.ts#L141)

___

### PerformanceHelpers

• `Const` **PerformanceHelpers**: `Object`

Performance testing utilities

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `expectResponseTimeWithinLimit` | (`executionTime`: `number`, `maxTime`: `number`) => `void` | - |
| `measureExecutionTime` | (`fn`: () => `Promise`\<`any`\>) => `Promise`\<`number`\> | - |

#### Defined in

[server/src/controllers/__tests__/mocks.ts:294](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/__tests__/mocks.ts#L294)

___

### TestDataFactory

• `Const` **TestDataFactory**: `Object`

Test Data Factory for AI API Payloads

Creates valid default payloads with ability to override specific properties
for testing different scenarios (valid/invalid data, edge cases, etc.)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `createAITaskResponse` | (`taskType`: [`AITaskType`](types_AI.md#aitasktype), `overrides`: `Partial`\<`any`\>) => \{ `processingTimeMs`: `number` = 1500; `result`: [`Lesson`](../interfaces/models_Lesson.Lesson.md) ; `status`: ``"completed"`` ; `taskId`: `string` ; `taskType`: [`AITaskType`](types_AI.md#aitasktype) ; `timestamp`: `string`  } \| \{ `processingTimeMs`: `number` = 1500; `result`: \{ `feedback`: `string` ; `improvements?`: `string`[] ; `score`: `number`  } ; `status`: ``"completed"`` ; `taskId`: `string` ; `taskType`: [`AITaskType`](types_AI.md#aitasktype) ; `timestamp`: `string`  } \| \{ `processingTimeMs`: `number` = 1500; `result`: \{ `feedback`: `string` ; `isCorrect`: `boolean` ; `score`: `number` ; `suggestions?`: `string`[]  } ; `status`: ``"completed"`` ; `taskId`: `string` ; `taskType`: [`AITaskType`](types_AI.md#aitasktype) ; `timestamp`: `string`  } \| \{ `processingTimeMs`: `number` = 1500; `result`: \{ `message`: `string` = 'Task completed successfully' } ; `status`: ``"completed"`` ; `taskId`: `string` ; `taskType`: [`AITaskType`](types_AI.md#aitasktype) ; `timestamp`: `string`  } | - |
| `createAssessPronunciationPayload` | (`overrides`: `Partial`\<\{ `audioUrl`: `string` ; `expectedPhrase`: `string`  }\>) => \{ `audioUrl`: `string` = 'https://example.com/audio.wav'; `expectedPhrase`: `string` = 'Bonjour, comment allez-vous?' } | - |
| `createGenerateLessonPayload` | (`overrides`: `Partial`\<\{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime?`: `number` ; `topic`: `string`  }\>) => \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime`: `number` = 15; `topic`: `string` = 'Subjunctive Mood' } | - |
| `createGradeResponsePayload` | (`overrides`: `Partial`\<\{ `correctAnswer`: `string` ; `questionType`: ``"multiple_choice"`` \| ``"fill_blank"`` \| ``"translation"`` \| ``"essay"`` ; `userResponse`: `string`  }\>) => \{ `correctAnswer`: `string` = 'Je vais bien'; `questionType`: ``"multiple_choice"`` \| ``"fill_blank"`` \| ``"translation"`` \| ``"essay"`` ; `userResponse`: `string` = 'Je suis bien' } | - |

#### Defined in

[server/src/controllers/__tests__/mocks.ts:29](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/__tests__/mocks.ts#L29)

___

### TestHelpers

• `Const` **TestHelpers**: `Object`

Test helper functions

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `assertions` | \{ `expectErrorResponse`: (`response`: `any`, `statusCode`: `number`, `errorMessage?`: `string`) => `void` ; `expectSuccessResponse`: (`response`: `any`, `expectedData?`: `any`) => `void` ; `expectValidationError`: (`response`: `any`, `fieldPath`: `string`) => `void`  } | Common test assertions |
| `assertions.expectErrorResponse` | (`response`: `any`, `statusCode`: `number`, `errorMessage?`: `string`) => `void` | - |
| `assertions.expectSuccessResponse` | (`response`: `any`, `expectedData?`: `any`) => `void` | - |
| `assertions.expectValidationError` | (`response`: `any`, `fieldPath`: `string`) => `void` | - |
| `createInvalidPayloads` | \{ `emptyString`: (`fieldName`: `string`) => \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime`: `number` = 15; `topic`: `string` = 'Subjunctive Mood' } ; `invalidFieldType`: (`fieldName`: `string`, `invalidValue`: `any`) => \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime`: `number` = 15; `topic`: `string` = 'Subjunctive Mood' } ; `missingRequiredField`: (`fieldName`: `string`) => \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime`: `number` = 15; `topic`: `string` = 'Subjunctive Mood' } ; `tooLongString`: (`fieldName`: `string`, `maxLength`: `number`) => \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime`: `number` = 15; `topic`: `string` = 'Subjunctive Mood' }  } | Creates invalid payloads for testing validation errors |
| `createInvalidPayloads.emptyString` | (`fieldName`: `string`) => \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime`: `number` = 15; `topic`: `string` = 'Subjunctive Mood' } | - |
| `createInvalidPayloads.invalidFieldType` | (`fieldName`: `string`, `invalidValue`: `any`) => \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime`: `number` = 15; `topic`: `string` = 'Subjunctive Mood' } | - |
| `createInvalidPayloads.missingRequiredField` | (`fieldName`: `string`) => \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime`: `number` = 15; `topic`: `string` = 'Subjunctive Mood' } | - |
| `createInvalidPayloads.tooLongString` | (`fieldName`: `string`, `maxLength`: `number`) => \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` ; `estimatedTime`: `number` = 15; `topic`: `string` = 'Subjunctive Mood' } | - |

#### Defined in

[server/src/controllers/__tests__/mocks.ts:227](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/__tests__/mocks.ts#L227)
