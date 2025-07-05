[server](../README.md) / [Exports](../modules.md) / models/Topic

# Module: models/Topic

## Table of contents

### Interfaces

- [Topic](../interfaces/models_Topic.Topic.md)

### Functions

- [createTopic](models_Topic.md#createtopic)
- [deleteTopicById](models_Topic.md#deletetopicbyid)
- [getAllTopics](models_Topic.md#getalltopics)
- [getTopicById](models_Topic.md#gettopicbyid)
- [updateTopicById](models_Topic.md#updatetopicbyid)

## Functions

### createTopic

▸ **createTopic**(`topic`): `Promise`\<[`Topic`](../interfaces/models_Topic.Topic.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `topic` | `Omit`\<[`Topic`](../interfaces/models_Topic.Topic.md), ``"id"``\> |

#### Returns

`Promise`\<[`Topic`](../interfaces/models_Topic.Topic.md)\>

#### Defined in

[server/src/models/Topic.ts:13](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Topic.ts#L13)

___

### deleteTopicById

▸ **deleteTopicById**(`id`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[server/src/models/Topic.ts:29](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Topic.ts#L29)

___

### getAllTopics

▸ **getAllTopics**(): `Promise`\<[`Topic`](../interfaces/models_Topic.Topic.md)[]\>

#### Returns

`Promise`\<[`Topic`](../interfaces/models_Topic.Topic.md)[]\>

#### Defined in

[server/src/models/Topic.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Topic.ts#L9)

___

### getTopicById

▸ **getTopicById**(`id`): `Promise`\<``null`` \| [`Topic`](../interfaces/models_Topic.Topic.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`\<``null`` \| [`Topic`](../interfaces/models_Topic.Topic.md)\>

#### Defined in

[server/src/models/Topic.ts:18](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Topic.ts#L18)

___

### updateTopicById

▸ **updateTopicById**(`id`, `topic`): `Promise`\<``null`` \| [`Topic`](../interfaces/models_Topic.Topic.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |
| `topic` | `Partial`\<[`Topic`](../interfaces/models_Topic.Topic.md)\> |

#### Returns

`Promise`\<``null`` \| [`Topic`](../interfaces/models_Topic.Topic.md)\>

#### Defined in

[server/src/models/Topic.ts:23](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Topic.ts#L23)
