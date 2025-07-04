[server](../README.md) / [Exports](../modules.md) / controllers/aiController

# Module: controllers/aiController

## Table of contents

### Functions

- [assessPronunciation](controllers_aiController.md#assesspronunciation)
- [cancelJob](controllers_aiController.md#canceljob)
- [chatWithAI](controllers_aiController.md#chatwithai)
- [generateContentAsync](controllers_aiController.md#generatecontentasync)
- [generateLesson](controllers_aiController.md#generatelesson)
- [getGenerationStatus](controllers_aiController.md#getgenerationstatus)
- [getPrompts](controllers_aiController.md#getprompts)
- [gradeResponse](controllers_aiController.md#graderesponse)
- [listJobs](controllers_aiController.md#listjobs)

## Functions

### assessPronunciation

▸ **assessPronunciation**(`req`, `res`): `Promise`\<`void`\>

Controller function for pronunciation assessment
POST /api/ai/assess-pronunciation

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/aiController.ts:319](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/aiController.ts#L319)

___

### cancelJob

▸ **cancelJob**(`req`, `res`): `Promise`\<`undefined` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

[ASYNC] Controller for cancelling a content generation job.
DELETE /api/ai/jobs/:jobId

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`undefined` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

#### Defined in

[server/src/controllers/aiController.ts:205](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/aiController.ts#L205)

___

### chatWithAI

▸ **chatWithAI**(`req`, `res`): `Promise`\<`void`\>

Legacy chat endpoint - maintained for backward compatibility

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

**`Deprecated`**

Use the new AI orchestration endpoints instead

#### Defined in

[server/src/controllers/aiController.ts:338](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/aiController.ts#L338)

___

### generateContentAsync

▸ **generateContentAsync**(`req`, `res`): `Promise`\<`void`\>

[ASYNC] Controller for initiating a content generation job.
POST /api/ai/generate

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/aiController.ts:232](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/aiController.ts#L232)

___

### generateLesson

▸ **generateLesson**(`req`, `res`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

**`Deprecated`**

Use generateContentAsync instead.
Controller function for lesson generation
POST /api/ai/generate-lesson

#### Defined in

[server/src/controllers/aiController.ts:312](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/aiController.ts#L312)

___

### getGenerationStatus

▸ **getGenerationStatus**(`req`, `res`): `Promise`\<`void`\>

[ASYNC] Controller for checking the status of a content generation job.
GET /api/ai/generate/status/:jobId

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/aiController.ts:267](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/aiController.ts#L267)

___

### getPrompts

▸ **getPrompts**(`req`, `res`): `Promise`\<`void`\>

Legacy prompts endpoint - maintained for backward compatibility

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

**`Deprecated`**

Use the new AI orchestration endpoints instead

#### Defined in

[server/src/controllers/aiController.ts:364](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/aiController.ts#L364)

___

### gradeResponse

▸ **gradeResponse**(`req`, `res`): `Promise`\<`void`\>

Controller function for response grading
POST /api/ai/grade-response

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/aiController.ts:326](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/aiController.ts#L326)

___

### listJobs

▸ **listJobs**(`req`, `res`): `Promise`\<`undefined` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

[ASYNC] Controller for listing a user's content generation jobs.
GET /api/ai/jobs

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`undefined` \| `Response`\<`any`, `Record`\<`string`, `any`\>\>\>

#### Defined in

[server/src/controllers/aiController.ts:178](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/aiController.ts#L178)
