[server](../README.md) / [Exports](../modules.md) / [models/AIGeneratedContent](../modules/models_AIGeneratedContent.md) / AIGeneratedContentData

# Interface: AIGeneratedContentData

[models/AIGeneratedContent](../modules/models_AIGeneratedContent.md).AIGeneratedContentData

## Implemented by

- [`AIGeneratedContent`](../classes/models_AIGeneratedContent.AIGeneratedContent.md)

## Table of contents

### Properties

- [createdAt](models_AIGeneratedContent.AIGeneratedContentData.md#createdat)
- [estimatedCompletionTime](models_AIGeneratedContent.AIGeneratedContentData.md#estimatedcompletiontime)
- [expiresAt](models_AIGeneratedContent.AIGeneratedContentData.md#expiresat)
- [focusAreas](models_AIGeneratedContent.AIGeneratedContentData.md#focusareas)
- [generatedData](models_AIGeneratedContent.AIGeneratedContentData.md#generateddata)
- [generationTimeMs](models_AIGeneratedContent.AIGeneratedContentData.md#generationtimems)
- [id](models_AIGeneratedContent.AIGeneratedContentData.md#id)
- [lastAccessedAt](models_AIGeneratedContent.AIGeneratedContentData.md#lastaccessedat)
- [level](models_AIGeneratedContent.AIGeneratedContentData.md#level)
- [metadata](models_AIGeneratedContent.AIGeneratedContentData.md#metadata)
- [modelUsed](models_AIGeneratedContent.AIGeneratedContentData.md#modelused)
- [requestPayload](models_AIGeneratedContent.AIGeneratedContentData.md#requestpayload)
- [status](models_AIGeneratedContent.AIGeneratedContentData.md#status)
- [tokenUsage](models_AIGeneratedContent.AIGeneratedContentData.md#tokenusage)
- [topics](models_AIGeneratedContent.AIGeneratedContentData.md#topics)
- [type](models_AIGeneratedContent.AIGeneratedContentData.md#type)
- [updatedAt](models_AIGeneratedContent.AIGeneratedContentData.md#updatedat)
- [usageCount](models_AIGeneratedContent.AIGeneratedContentData.md#usagecount)
- [userId](models_AIGeneratedContent.AIGeneratedContentData.md#userid)
- [validationResults](models_AIGeneratedContent.AIGeneratedContentData.md#validationresults)
- [validationScore](models_AIGeneratedContent.AIGeneratedContentData.md#validationscore)

## Properties

### createdAt

• **createdAt**: `Date`

#### Defined in

[server/src/models/AIGeneratedContent.ts:26](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L26)

___

### estimatedCompletionTime

• `Optional` **estimatedCompletionTime**: `number`

#### Defined in

[server/src/models/AIGeneratedContent.ts:18](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L18)

___

### expiresAt

• `Optional` **expiresAt**: `Date`

#### Defined in

[server/src/models/AIGeneratedContent.ts:25](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L25)

___

### focusAreas

• `Optional` **focusAreas**: `string`[]

#### Defined in

[server/src/models/AIGeneratedContent.ts:17](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L17)

___

### generatedData

• `Optional` **generatedData**: `any`

#### Defined in

[server/src/models/AIGeneratedContent.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L12)

___

### generationTimeMs

• `Optional` **generationTimeMs**: `number`

#### Defined in

[server/src/models/AIGeneratedContent.ts:20](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L20)

___

### id

• **id**: `string`

#### Defined in

[server/src/models/AIGeneratedContent.ts:7](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L7)

___

### lastAccessedAt

• `Optional` **lastAccessedAt**: `Date`

#### Defined in

[server/src/models/AIGeneratedContent.ts:24](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L24)

___

### level

• `Optional` **level**: `string`

#### Defined in

[server/src/models/AIGeneratedContent.ts:15](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L15)

___

### metadata

• `Optional` **metadata**: `any`

#### Defined in

[server/src/models/AIGeneratedContent.ts:14](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L14)

___

### modelUsed

• `Optional` **modelUsed**: `string`

#### Defined in

[server/src/models/AIGeneratedContent.ts:22](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L22)

___

### requestPayload

• **requestPayload**: `any`

#### Defined in

[server/src/models/AIGeneratedContent.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L11)

___

### status

• **status**: ``"pending"`` \| ``"completed"`` \| ``"failed"`` \| ``"generating"`` \| ``"cached"``

#### Defined in

[server/src/models/AIGeneratedContent.ts:10](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L10)

___

### tokenUsage

• `Optional` **tokenUsage**: `number`

#### Defined in

[server/src/models/AIGeneratedContent.ts:21](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L21)

___

### topics

• `Optional` **topics**: `string`[]

#### Defined in

[server/src/models/AIGeneratedContent.ts:16](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L16)

___

### type

• **type**: ``"lesson"`` \| ``"vocabulary_drill"`` \| ``"grammar_exercise"`` \| ``"cultural_content"`` \| ``"personalized_exercise"`` \| ``"pronunciation_drill"`` \| ``"conversation_practice"``

#### Defined in

[server/src/models/AIGeneratedContent.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L9)

___

### updatedAt

• **updatedAt**: `Date`

#### Defined in

[server/src/models/AIGeneratedContent.ts:27](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L27)

___

### usageCount

• **usageCount**: `number`

#### Defined in

[server/src/models/AIGeneratedContent.ts:23](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L23)

___

### userId

• **userId**: `number`

#### Defined in

[server/src/models/AIGeneratedContent.ts:8](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L8)

___

### validationResults

• `Optional` **validationResults**: `any`

#### Defined in

[server/src/models/AIGeneratedContent.ts:13](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L13)

___

### validationScore

• `Optional` **validationScore**: `number`

#### Defined in

[server/src/models/AIGeneratedContent.ts:19](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L19)
