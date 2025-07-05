[server](../README.md) / [Exports](../modules.md) / types/AI

# Module: types/AI

## Table of contents

### Interfaces

- [AIRequest](../interfaces/types_AI.AIRequest.md)
- [AIResponse](../interfaces/types_AI.AIResponse.md)
- [AITaskPayloads](../interfaces/types_AI.AITaskPayloads.md)
- [CacheStrategyConfig](../interfaces/types_AI.CacheStrategyConfig.md)
- [FallbackStrategyConfig](../interfaces/types_AI.FallbackStrategyConfig.md)
- [OrchestrationConfig](../interfaces/types_AI.OrchestrationConfig.md)
- [RateLimitStrategyConfig](../interfaces/types_AI.RateLimitStrategyConfig.md)

### Type Aliases

- [AIServiceMethod](types_AI.md#aiservicemethod)
- [AITaskRequestPayload](types_AI.md#aitaskrequestpayload)
- [AITaskResponsePayload](types_AI.md#aitaskresponsepayload)
- [AITaskType](types_AI.md#aitasktype)
- [AIUserContext](types_AI.md#aiusercontext)
- [AnyAIRequest](types_AI.md#anyairequest)
- [AnyAIResponse](types_AI.md#anyairesponse)

## Type Aliases

### AIServiceMethod

Ƭ **AIServiceMethod**\<`T`\>: `Object`

**`Description`**

Helper type for creating strongly-typed AI service methods.

**`Example`**

```ts
async generateLesson(request: AIServiceMethod<'GENERATE_LESSON'>['request']): Promise<AIServiceMethod<'GENERATE_LESSON'>['response']>
```

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends keyof [`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md) | The AI task type |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | [`AIRequest`](../interfaces/types_AI.AIRequest.md)\<`T`\> |
| `response` | [`AIResponse`](../interfaces/types_AI.AIResponse.md)\<`T`\> |

#### Defined in

[server/src/types/AI.ts:289](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L289)

___

### AITaskRequestPayload

Ƭ **AITaskRequestPayload**\<`T`\>: [`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md)[`T`][``"request"``]

**`Description`**

Utility type to extract the request payload for a given AI task.

**`Example`**

```ts
AITaskRequestPayload<'GENERATE_LESSON'> // { topic: string; difficulty: 'beginner' | 'intermediate' | 'advanced'; }
```

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends keyof [`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md) | The AI task type |

#### Defined in

[server/src/types/AI.ts:216](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L216)

___

### AITaskResponsePayload

Ƭ **AITaskResponsePayload**\<`T`\>: [`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md)[`T`][``"response"``]

**`Description`**

Utility type to extract the response payload for a given AI task.

**`Example`**

```ts
AITaskResponsePayload<'GENERATE_LESSON'> // Lesson
```

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends keyof [`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md) | The AI task type |

#### Defined in

[server/src/types/AI.ts:223](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L223)

___

### AITaskType

Ƭ **AITaskType**: ``"GENERATE_LESSON"`` \| ``"ASSESS_PRONUNCIATION"`` \| ``"GRADE_RESPONSE"`` \| ``"GENERATE_CURRICULUM_PATH"`` \| ``"CONVERSATIONAL_TUTOR_RESPONSE"``

**`Description`**

Defines the types of tasks the AI Orchestrator can handle.
             Using string literal union for type safety and autocompletion.

#### Defined in

[server/src/types/AI.ts:27](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L27)

___

### AIUserContext

Ƭ **AIUserContext**: `Pick`\<[`UserApplicationData`](../interfaces/models_User.UserApplicationData.md), ``"id"`` \| ``"firstName"`` \| ``"role"``\> & \{ `preferences`: `any`  }

**`Description`**

A lean, performance-optimized representation of user context for AI personalization.
             Uses Pick utility to select only necessary fields from larger models,
             reducing database queries and network payload size.

#### Defined in

[server/src/types/AI.ts:43](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L43)

___

### AnyAIRequest

Ƭ **AnyAIRequest**: \{ [K in keyof AITaskPayloads]: AIRequest\<K\> }[keyof [`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md)]

**`Description`**

Union type of all possible AI request types for generic handling.

#### Defined in

[server/src/types/AI.ts:297](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L297)

___

### AnyAIResponse

Ƭ **AnyAIResponse**: \{ [K in keyof AITaskPayloads]: AIResponse\<K\> }[keyof [`AITaskPayloads`](../interfaces/types_AI.AITaskPayloads.md)]

**`Description`**

Union type of all possible AI response types for generic handling.

#### Defined in

[server/src/types/AI.ts:304](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/AI.ts#L304)
