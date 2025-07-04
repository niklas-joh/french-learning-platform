[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / JobStatus

# Interface: JobStatus

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).JobStatus

## Table of contents

### Properties

- [error](services_contentGeneration_interfaces.JobStatus.md#error)
- [estimatedCompletion](services_contentGeneration_interfaces.JobStatus.md#estimatedcompletion)
- [id](services_contentGeneration_interfaces.JobStatus.md#id)
- [progress](services_contentGeneration_interfaces.JobStatus.md#progress)
- [status](services_contentGeneration_interfaces.JobStatus.md#status)

## Properties

### error

• `Optional` **error**: `string`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:126](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L126)

___

### estimatedCompletion

• `Optional` **estimatedCompletion**: `Date`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:125](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L125)

___

### id

• **id**: `string`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:122](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L122)

___

### progress

• `Optional` **progress**: `number`

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:124](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L124)

___

### status

• **status**: ``"completed"`` \| ``"queued"`` \| ``"processing"`` \| ``"failed"`` \| ``"cancelled"``

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:123](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L123)
