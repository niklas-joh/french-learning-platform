[server](../README.md) / [Exports](../modules.md) / controllers/ai.validators

# Module: controllers/ai.validators

## Table of contents

### Type Aliases

- [ValidatedAITask](controllers_ai_validators.md#validatedaitask)

### Variables

- [assessPronunciationPayloadSchema](controllers_ai_validators.md#assesspronunciationpayloadschema)
- [generateLessonPayloadSchema](controllers_ai_validators.md#generatelessonpayloadschema)
- [gradeResponsePayloadSchema](controllers_ai_validators.md#graderesponsepayloadschema)
- [paginationSchema](controllers_ai_validators.md#paginationschema)
- [validationSchemaMap](controllers_ai_validators.md#validationschemamap)

### Functions

- [formatValidationError](controllers_ai_validators.md#formatvalidationerror)
- [validateAIPayload](controllers_ai_validators.md#validateaipayload)

## Type Aliases

### ValidatedAITask

Ƭ **ValidatedAITask**: keyof typeof [`validationSchemaMap`](controllers_ai_validators.md#validationschemamap)

Type for extracting schema keys (for type safety)

#### Defined in

[server/src/controllers/ai.validators.ts:106](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/ai.validators.ts#L106)

## Variables

### assessPronunciationPayloadSchema

• `Const` **assessPronunciationPayloadSchema**: `ZodObject`\<\{ `audioUrl`: `ZodString` ; `expectedPhrase`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `audioUrl`: `string` ; `expectedPhrase`: `string`  }, \{ `audioUrl`: `string` ; `expectedPhrase`: `string`  }\>

Validation schema for pronunciation assessment requests
Corresponds to AITaskPayloads['ASSESS_PRONUNCIATION']['request']

#### Defined in

[server/src/controllers/ai.validators.ts:42](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/ai.validators.ts#L42)

___

### generateLessonPayloadSchema

• `Const` **generateLessonPayloadSchema**: `ZodObject`\<\{ `difficulty`: `ZodEnum`\<[``"beginner"``, ``"intermediate"``, ``"advanced"``, ``"adaptive"``]\> ; `estimatedTime`: `ZodOptional`\<`ZodNumber`\> ; `topic`: `ZodString` ; `type`: `ZodLiteral`\<``"lesson"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` \| ``"adaptive"`` ; `estimatedTime?`: `number` ; `topic`: `string` ; `type`: ``"lesson"``  }, \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` \| ``"adaptive"`` ; `estimatedTime?`: `number` ; `topic`: `string` ; `type`: ``"lesson"``  }\>

Validation schema for lesson generation requests
Corresponds to AITaskPayloads['GENERATE_LESSON']['request']

#### Defined in

[server/src/controllers/ai.validators.ts:23](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/ai.validators.ts#L23)

___

### gradeResponsePayloadSchema

• `Const` **gradeResponsePayloadSchema**: `ZodObject`\<\{ `correctAnswer`: `ZodString` ; `questionType`: `ZodEnum`\<[``"multiple_choice"``, ``"fill_blank"``, ``"translation"``, ``"essay"``]\> ; `userResponse`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `correctAnswer`: `string` ; `questionType`: ``"multiple_choice"`` \| ``"fill_blank"`` \| ``"translation"`` \| ``"essay"`` ; `userResponse`: `string`  }, \{ `correctAnswer`: `string` ; `questionType`: ``"multiple_choice"`` \| ``"fill_blank"`` \| ``"translation"`` \| ``"essay"`` ; `userResponse`: `string`  }\>

Validation schema for response grading requests
Corresponds to AITaskPayloads['GRADE_RESPONSE']['request']

#### Defined in

[server/src/controllers/ai.validators.ts:55](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/ai.validators.ts#L55)

___

### paginationSchema

• `Const` **paginationSchema**: `ZodObject`\<\{ `page`: `ZodDefault`\<`ZodNumber`\> ; `pageSize`: `ZodDefault`\<`ZodNumber`\>  }, ``"strip"``, `ZodTypeAny`, \{ `page`: `number` ; `pageSize`: `number`  }, \{ `page?`: `number` ; `pageSize?`: `number`  }\>

Validation schema for pagination query parameters

#### Defined in

[server/src/controllers/ai.validators.ts:70](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/ai.validators.ts#L70)

___

### validationSchemaMap

• `Const` **validationSchemaMap**: `Object`

Map of AI task types to their corresponding validation schemas
This provides a type-safe way to access validators based on task type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ASSESS_PRONUNCIATION` | `ZodObject`\<\{ `audioUrl`: `ZodString` ; `expectedPhrase`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `audioUrl`: `string` ; `expectedPhrase`: `string`  }, \{ `audioUrl`: `string` ; `expectedPhrase`: `string`  }\> |
| `GENERATE_LESSON` | `ZodObject`\<\{ `difficulty`: `ZodEnum`\<[``"beginner"``, ``"intermediate"``, ``"advanced"``, ``"adaptive"``]\> ; `estimatedTime`: `ZodOptional`\<`ZodNumber`\> ; `topic`: `ZodString` ; `type`: `ZodLiteral`\<``"lesson"``\>  }, ``"strip"``, `ZodTypeAny`, \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` \| ``"adaptive"`` ; `estimatedTime?`: `number` ; `topic`: `string` ; `type`: ``"lesson"``  }, \{ `difficulty`: ``"beginner"`` \| ``"intermediate"`` \| ``"advanced"`` \| ``"adaptive"`` ; `estimatedTime?`: `number` ; `topic`: `string` ; `type`: ``"lesson"``  }\> |
| `GRADE_RESPONSE` | `ZodObject`\<\{ `correctAnswer`: `ZodString` ; `questionType`: `ZodEnum`\<[``"multiple_choice"``, ``"fill_blank"``, ``"translation"``, ``"essay"``]\> ; `userResponse`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `correctAnswer`: `string` ; `questionType`: ``"multiple_choice"`` \| ``"fill_blank"`` \| ``"translation"`` \| ``"essay"`` ; `userResponse`: `string`  }, \{ `correctAnswer`: `string` ; `questionType`: ``"multiple_choice"`` \| ``"fill_blank"`` \| ``"translation"`` \| ``"essay"`` ; `userResponse`: `string`  }\> |

#### Defined in

[server/src/controllers/ai.validators.ts:96](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/ai.validators.ts#L96)

## Functions

### formatValidationError

▸ **formatValidationError**(`error`): `Object`

Formats Zod validation errors for API responses

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | `ZodError`\<`any`\> | The Zod validation error |

#### Returns

`Object`

User-friendly error message and details

| Name | Type |
| :------ | :------ |
| `details` | \{ `field`: `string` ; `message`: `string`  }[] |
| `message` | `string` |

#### Defined in

[server/src/controllers/ai.validators.ts:141](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/ai.validators.ts#L141)

___

### validateAIPayload

▸ **validateAIPayload**\<`T`\>(`taskType`, `payload`): \{ `data`: `z.infer`\<typeof [`validationSchemaMap`](controllers_ai_validators.md#validationschemamap)[`T`]\> ; `success`: ``true``  } \| \{ `error`: `z.ZodError` ; `success`: ``false``  }

Utility function to validate a payload against its corresponding schema

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"GENERATE_LESSON"`` \| ``"ASSESS_PRONUNCIATION"`` \| ``"GRADE_RESPONSE"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskType` | `T` | The AI task type |
| `payload` | `unknown` | The payload to validate |

#### Returns

\{ `data`: `z.infer`\<typeof [`validationSchemaMap`](controllers_ai_validators.md#validationschemamap)[`T`]\> ; `success`: ``true``  } \| \{ `error`: `z.ZodError` ; `success`: ``false``  }

Validation result with parsed data or error details

#### Defined in

[server/src/controllers/ai.validators.ts:115](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/ai.validators.ts#L115)
