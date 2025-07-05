[server](../README.md) / [Exports](../modules.md) / [services/ai/FallbackHandler](../modules/services_ai_FallbackHandler.md) / FallbackHandler

# Class: FallbackHandler

[services/ai/FallbackHandler](../modules/services_ai_FallbackHandler.md).FallbackHandler

FallbackHandler

**`Description`**

Provides type-safe, structured fallback responses when AI services fail.
             Ensures client applications receive valid data structures even during failures.

## Table of contents

### Constructors

- [constructor](services_ai_FallbackHandler.FallbackHandler.md#constructor)

### Properties

- [config](services_ai_FallbackHandler.FallbackHandler.md#config)
- [logger](services_ai_FallbackHandler.FallbackHandler.md#logger)

### Methods

- [deepMerge](services_ai_FallbackHandler.FallbackHandler.md#deepmerge)
- [generateFallbackData](services_ai_FallbackHandler.FallbackHandler.md#generatefallbackdata)
- [getConfigurationSummary](services_ai_FallbackHandler.FallbackHandler.md#getconfigurationsummary)
- [getFallback](services_ai_FallbackHandler.FallbackHandler.md#getfallback)
- [mergeWithDefaults](services_ai_FallbackHandler.FallbackHandler.md#mergewithdefaults)
- [validateAllConfigurations](services_ai_FallbackHandler.FallbackHandler.md#validateallconfigurations)
- [validateFallbackConfig](services_ai_FallbackHandler.FallbackHandler.md#validatefallbackconfig)

## Constructors

### constructor

• **new FallbackHandler**(`config`, `logger?`): [`FallbackHandler`](services_ai_FallbackHandler.FallbackHandler.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `config` | [`FallbackStrategyConfig`](../interfaces/types_AI.FallbackStrategyConfig.md) | `undefined` | Fallback strategy configuration with type-safe static content |
| `logger` | `ILogger` | `console` | Logger instance (defaults to console for now) |

#### Returns

[`FallbackHandler`](services_ai_FallbackHandler.FallbackHandler.md)

#### Defined in

[server/src/services/ai/FallbackHandler.ts:47](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L47)

## Properties

### config

• `Private` **config**: [`FallbackStrategyConfig`](../interfaces/types_AI.FallbackStrategyConfig.md)

#### Defined in

[server/src/services/ai/FallbackHandler.ts:39](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L39)

___

### logger

• `Private` **logger**: `ILogger`

#### Defined in

[server/src/services/ai/FallbackHandler.ts:40](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L40)

## Methods

### deepMerge

▸ **deepMerge**(`target`, `source`): `any`

Performs a deep merge of two objects, with source overriding target values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `any` | The target object (defaults) |
| `source` | `any` | The source object (static content) |

#### Returns

`any`

Merged object

#### Defined in

[server/src/services/ai/FallbackHandler.ts:203](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L203)

___

### generateFallbackData

▸ **generateFallbackData**\<`T`\>(`taskType`, `staticContent`, `error`): `any`

Generates appropriate fallback data based on the task type and configuration.

This method provides sensible defaults for each AI task type while allowing
customization through the static content configuration.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskType` | `T` | The AI task type |
| `staticContent` | `any` | Configured static content (if any) |
| `error` | `Error` | The original error for context |

#### Returns

`any`

Fallback data structure appropriate for the task type

#### Defined in

[server/src/services/ai/FallbackHandler.ts:109](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L109)

___

### getConfigurationSummary

▸ **getConfigurationSummary**(): `Object`

Gets a summary of configured fallback content for monitoring and debugging.

#### Returns

`Object`

Object describing configured fallbacks

| Name | Type |
| :------ | :------ |
| `configuredTasks` | [`AITaskType`](../modules/types_AI.md#aitasktype)[] |
| `enabled` | `boolean` |
| `totalConfigurations` | `number` |

#### Defined in

[server/src/services/ai/FallbackHandler.ts:255](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L255)

___

### getFallback

▸ **getFallback**\<`T`\>(`taskType`, `error`): [`AIResponse`](../interfaces/types_AI.AIResponse.md)\<`T`\>

Generates a type-safe fallback response for a specific AI task that failed.

The response maintains the same structure as a successful AI response but with
status 'fallback' and uses predefined static content when available, or
generates a safe default structure for the specific task type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskType` | `T` | The AI task type that failed |
| `error` | `Error` | The error that triggered the fallback |

#### Returns

[`AIResponse`](../interfaces/types_AI.AIResponse.md)\<`T`\>

A properly structured AIResponse with fallback content

#### Defined in

[server/src/services/ai/FallbackHandler.ts:64](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L64)

___

### mergeWithDefaults

▸ **mergeWithDefaults**\<`T`\>(`taskType`, `staticContent`): `any`

Merges configured static content with sensible defaults for the task type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskType` | `T` | The AI task type |
| `staticContent` | `any` | User-configured static content |

#### Returns

`any`

Merged fallback data

#### Defined in

[server/src/services/ai/FallbackHandler.ts:185](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L185)

___

### validateAllConfigurations

▸ **validateAllConfigurations**(): \{ `error?`: `string` ; `isValid`: `boolean` ; `taskType`: [`AITaskType`](../modules/types_AI.md#aitasktype)  }[]

Tests all configured fallbacks to ensure they generate valid responses.
Useful for startup validation and health checks.

#### Returns

\{ `error?`: `string` ; `isValid`: `boolean` ; `taskType`: [`AITaskType`](../modules/types_AI.md#aitasktype)  }[]

Array of validation results for each configured task type

#### Defined in

[server/src/services/ai/FallbackHandler.ts:275](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L275)

___

### validateFallbackConfig

▸ **validateFallbackConfig**\<`T`\>(`taskType`): `boolean`

Validates that the fallback configuration contains valid data for a task type.
Useful for configuration validation during startup.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AITaskType`](../modules/types_AI.md#aitasktype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskType` | `T` | The AI task type to validate |

#### Returns

`boolean`

true if configuration is valid, false otherwise

#### Defined in

[server/src/services/ai/FallbackHandler.ts:233](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/ai/FallbackHandler.ts#L233)
