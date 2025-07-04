[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IJobQueueService

# Interface: IJobQueueService

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IJobQueueService

Interface for a job queue service.
This service is responsible for enqueuing jobs for asynchronous processing.

## Implemented by

- [`DatabaseJobQueueService`](../classes/services_contentGeneration_DatabaseJobQueueService.DatabaseJobQueueService.md)

## Table of contents

### Methods

- [enqueueJob](services_contentGeneration_interfaces.IJobQueueService.md#enqueuejob)

## Methods

### enqueueJob

▸ **enqueueJob**(`jobData`): `Promise`\<`string`\>

Enqueues a job for processing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jobData` | `any` | The data required to process the job. |

#### Returns

`Promise`\<`string`\>

A promise that resolves with the ID of the enqueued job.

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:118](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L118)
