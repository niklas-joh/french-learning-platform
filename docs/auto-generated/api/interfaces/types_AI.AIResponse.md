[server](../README.md) / [Exports](../modules.md) / [types/AI](../modules/types_AI.md) / AIResponse

# Interface: AIResponse\<T\>

[types/AI](../modules/types_AI.md).AIResponse

**`Description`**

Standardized, fully type-safe response structure from the AI Orchestrator.
             Includes comprehensive metadata for performance monitoring, cost tracking,
             and reliability analysis.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends keyof [`AITaskPayloads`](types_AI.AITaskPayloads.md) | The specific AI task type, which determines the response data structure |

## Table of contents

### Properties

- [data](types_AI.AIResponse.md#data)
- [error](types_AI.AIResponse.md#error)
- [metadata](types_AI.AIResponse.md#metadata)
- [status](types_AI.AIResponse.md#status)

## Properties

### data

• **data**: [`AITaskResponsePayload`](../modules/types_AI.md#aitaskresponsepayload)\<`T`\>

Task-specific response data, type-safe based on the task

#### Defined in

[server/src/types/AI.ts:254](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L254)

___

### error

• `Optional` **error**: `Object`

Error details if status is 'error'

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `code?` | `string` | Machine-readable error code |
| `message` | `string` | Human-readable error message |

#### Defined in

[server/src/types/AI.ts:271](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L271)

___

### metadata

• **metadata**: `Object`

Metadata for monitoring, analytics, and cost tracking

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheHit` | `boolean` | Whether the response came from cache |
| `confidenceScore?` | `number` | Confidence score for content validation (0-1) |
| `cost?` | `number` | Cost of the request in USD for budget tracking |
| `model` | `string` | Specific model used for the request |
| `processingTimeMs` | `number` | Request processing time in milliseconds |
| `provider` | `string` | AI provider that handled the request |

#### Defined in

[server/src/types/AI.ts:256](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L256)

___

### status

• **status**: ``"error"`` \| ``"success"`` \| ``"fallback"``

Outcome of the AI request

#### Defined in

[server/src/types/AI.ts:252](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L252)
