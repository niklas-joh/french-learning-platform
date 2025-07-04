[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/DatabaseJobQueueService](../modules/services_contentGeneration_DatabaseJobQueueService.md) / DatabaseJobQueueService

# Class: DatabaseJobQueueService

[services/contentGeneration/DatabaseJobQueueService](../modules/services_contentGeneration_DatabaseJobQueueService.md).DatabaseJobQueueService

A persistent job queue service using the database.
This implementation leverages the `ai_generation_jobs` table
to provide a reliable and scalable job queue.

## Implements

- [`IJobQueueService`](../interfaces/services_contentGeneration_interfaces.IJobQueueService.md)

## Table of contents

### Constructors

- [constructor](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#constructor)

### Properties

- [knex](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#knex)
- [logger](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#logger)

### Methods

- [calculateProgress](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#calculateprogress)
- [cancelJob](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#canceljob)
- [enqueueJob](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#enqueuejob)
- [getJobResult](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#getjobresult)
- [getJobStatus](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#getjobstatus)
- [getNextJob](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#getnextjob)
- [listJobsByUser](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#listjobsbyuser)
- [setJobResult](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#setjobresult)
- [updateJobStatus](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md#updatejobstatus)

## Constructors

### constructor

• **new DatabaseJobQueueService**(`knex`, `logger`): [`DatabaseJobQueueService`](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md)

Creates an instance of DatabaseJobQueueService.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `knex` | `Knex`\<`any`, `any`[]\> | The Knex instance for database connectivity. |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) | The logger instance for logging messages. |

#### Returns

[`DatabaseJobQueueService`](services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md)

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:18](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L18)

## Properties

### knex

• `Private` **knex**: `Knex`\<`any`, `any`[]\>

The Knex instance for database connectivity.

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:18](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L18)

___

### logger

• `Private` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

The logger instance for logging messages.

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:18](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L18)

## Methods

### calculateProgress

▸ **calculateProgress**(`status`): `number`

Calculates a progress percentage based on the job status.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `status` | `string` | The current status of the job. |

#### Returns

`number`

The progress percentage (0-100).

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:133](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L133)

___

### cancelJob

▸ **cancelJob**(`jobId`, `userId`): `Promise`\<`boolean`\>

Atomically cancels a job for a specific user.
This single query is more efficient and prevents race conditions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jobId` | `string` | The ID of the job to cancel. |
| `userId` | `number` | The ID of the user requesting the cancellation for authorization. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to true if a job was cancelled.

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:111](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L111)

___

### enqueueJob

▸ **enqueueJob**(`request`): `Promise`\<`string`\>

Enqueues a new content generation job by inserting it into the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`ContentRequest`](../interfaces/types_Content.ContentRequest.md) | The content generation request payload. |

#### Returns

`Promise`\<`string`\>

A promise that resolves with the ID of the newly created job.

#### Implementation of

[IJobQueueService](../interfaces/services_contentGeneration_interfaces.IJobQueueService.md).[enqueueJob](../interfaces/services_contentGeneration_interfaces.IJobQueueService.md#enqueuejob)

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:27](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L27)

___

### getJobResult

▸ **getJobResult**(`jobId`): `Promise`\<``null`` \| [`GeneratedContent`](../interfaces/types_Content.GeneratedContent.md)\>

Retrieves the result of a completed job.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jobId` | `string` | The ID of the job. |

#### Returns

`Promise`\<``null`` \| [`GeneratedContent`](../interfaces/types_Content.GeneratedContent.md)\>

A promise that resolves with the generated content, or null if the job is not complete or not found.

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:67](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L67)

___

### getJobStatus

▸ **getJobStatus**(`jobId`): `Promise`\<[`JobStatus`](../interfaces/services_contentGeneration_interfaces.JobStatus.md)\>

Retrieves the status of a specific job from the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jobId` | `string` | The ID of the job to check. |

#### Returns

`Promise`\<[`JobStatus`](../interfaces/services_contentGeneration_interfaces.JobStatus.md)\>

A promise that resolves with the job's status.

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:46](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L46)

___

### getNextJob

▸ **getNextJob**(): `Promise`\<``null`` \| \{ `id`: `string` ; `payload`: [`ContentRequest`](../interfaces/types_Content.ContentRequest.md)  }\>

Atomically fetches and locks the next available job.
Uses SELECT ... FOR UPDATE SKIP LOCKED to prevent race conditions.

#### Returns

`Promise`\<``null`` \| \{ `id`: `string` ; `payload`: [`ContentRequest`](../interfaces/types_Content.ContentRequest.md)  }\>

The job to be processed, or null if no jobs are available.

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:157](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L157)

___

### listJobsByUser

▸ **listJobsByUser**(`userId`, `page`, `pageSize`): `Promise`\<\{ `results`: [`AiGenerationJobsModel`](models_AiGenerationJob.AiGenerationJobsModel.md)[] ; `total`: `number`  }\>

Lists jobs for a user, selecting only necessary fields for performance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `number` | The ID of the user. |
| `page` | `number` | The page number to retrieve. |
| `pageSize` | `number` | The number of jobs per page. |

#### Returns

`Promise`\<\{ `results`: [`AiGenerationJobsModel`](models_AiGenerationJob.AiGenerationJobsModel.md)[] ; `total`: `number`  }\>

A promise that resolves with the paginated result, including total count.

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:83](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L83)

___

### setJobResult

▸ **setJobResult**(`jobId`, `result`): `Promise`\<`void`\>

Sets the result for a completed job.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jobId` | `string` | The ID of the job. |
| `result` | [`GeneratedContent`](../interfaces/types_Content.GeneratedContent.md) | The generated content. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:204](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L204)

___

### updateJobStatus

▸ **updateJobStatus**(`jobId`, `status`, `error?`): `Promise`\<`void`\>

Updates the status of a job.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jobId` | `string` | The ID of the job. |
| `status` | ``"completed"`` \| ``"queued"`` \| ``"processing"`` \| ``"failed"`` \| ``"cancelled"`` | The new status. |
| `error?` | `string` | Optional error message if the job failed. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/contentGeneration/DatabaseJobQueueService.ts:191](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/DatabaseJobQueueService.ts#L191)
