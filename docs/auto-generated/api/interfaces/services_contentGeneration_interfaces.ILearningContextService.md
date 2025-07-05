[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / ILearningContextService

# Interface: ILearningContextService

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).ILearningContextService

Interface for loading user learning context
TODO: Reference Future Implementation #18 - AI Context Service Optimization Strategy

## Implemented by

- [`ContextService`](../classes/services_ai_ContextService.ContextService.md)

## Table of contents

### Methods

- [getUserContext](services_contentGeneration_interfaces.ILearningContextService.md#getusercontext)
- [updateContext](services_contentGeneration_interfaces.ILearningContextService.md#updatecontext)

## Methods

### getUserContext

▸ **getUserContext**(`userId`): `Promise`\<[`LearningContext`](types_Content.LearningContext.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |

#### Returns

`Promise`\<[`LearningContext`](types_Content.LearningContext.md)\>

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:100](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L100)

___

### updateContext

▸ **updateContext**(`userId`, `updates`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |
| `updates` | `Partial`\<[`LearningContext`](types_Content.LearningContext.md)\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:101](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L101)
