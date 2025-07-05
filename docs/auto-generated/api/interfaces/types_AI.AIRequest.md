[server](../README.md) / [Exports](../modules.md) / [types/AI](../modules/types_AI.md) / AIRequest

# Interface: AIRequest\<T\>

[types/AI](../modules/types_AI.md).AIRequest

**`Description`**

Standardized, fully type-safe request structure for the AI Orchestrator.
             The payload type is automatically inferred from the task type,
             preventing mismatched data and enabling better developer experience.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends keyof [`AITaskPayloads`](types_AI.AITaskPayloads.md) | The specific AI task type, which determines the payload structure |

## Table of contents

### Properties

- [context](types_AI.AIRequest.md#context)
- [payload](types_AI.AIRequest.md#payload)
- [task](types_AI.AIRequest.md#task)

## Properties

### context

• **context**: [`AIUserContext`](../modules/types_AI.md#aiusercontext)

User context for personalization, optimized for performance

#### Defined in

[server/src/types/AI.ts:239](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L239)

___

### payload

• **payload**: [`AITaskRequestPayload`](../modules/types_AI.md#aitaskrequestpayload)\<`T`\>

Task-specific payload data, type-safe based on the task

#### Defined in

[server/src/types/AI.ts:241](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L241)

___

### task

• **task**: `T`

The specific AI task to be performed

#### Defined in

[server/src/types/AI.ts:237](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L237)
