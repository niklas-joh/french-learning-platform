[server](../README.md) / [Exports](../modules.md) / models/Content

# Module: models/Content

## Table of contents

### Interfaces

- [ContentApplicationData](../interfaces/models_Content.ContentApplicationData.md)
- [ContentSchema](../interfaces/models_Content.ContentSchema.md)

### Type Aliases

- [NewContent](models_Content.md#newcontent)

### Functions

- [createContent](models_Content.md#createcontent)
- [deleteContent](models_Content.md#deletecontent)
- [getAllContent](models_Content.md#getallcontent)
- [getContentById](models_Content.md#getcontentbyid)
- [getContentByTopicId](models_Content.md#getcontentbytopicid)
- [updateContent](models_Content.md#updatecontent)

## Type Aliases

### NewContent

Ƭ **NewContent**: `Omit`\<[`ContentSchema`](../interfaces/models_Content.ContentSchema.md), ``"id"`` \| ``"createdAt"`` \| ``"active"``\> & \{ `active?`: `boolean` ; `correctAnswer`: `any` ; `options?`: `any` ; `questionData`: `any` ; `tags?`: `any` ; `title?`: `string` ; `topicId?`: `number`  }

#### Defined in

[server/src/models/Content.ts:27](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Content.ts#L27)

## Functions

### createContent

▸ **createContent**(`contentData`): `Promise`\<[`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)\>

Inserts a new content record and returns the mapped result.

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentData` | [`NewContent`](models_Content.md#newcontent) |

#### Returns

`Promise`\<[`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)\>

#### Defined in

[server/src/models/Content.ts:136](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Content.ts#L136)

___

### deleteContent

▸ **deleteContent**(`id`): `Promise`\<`boolean`\>

Removes a content record.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[server/src/models/Content.ts:208](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Content.ts#L208)

___

### getAllContent

▸ **getAllContent**(): `Promise`\<[`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)[]\>

Retrieves all content records.

#### Returns

`Promise`\<[`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)[]\>

#### Defined in

[server/src/models/Content.ts:166](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Content.ts#L166)

___

### getContentById

▸ **getContentById**(`id`): `Promise`\<``null`` \| [`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)\>

Retrieves a single content item by id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`\<``null`` \| [`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)\>

#### Defined in

[server/src/models/Content.ts:115](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Content.ts#L115)

___

### getContentByTopicId

▸ **getContentByTopicId**(`topicId`): `Promise`\<[`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)[]\>

Returns all content belonging to the provided topic id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `topicId` | `number` |

#### Returns

`Promise`\<[`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)[]\>

#### Defined in

[server/src/models/Content.ts:127](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Content.ts#L127)

___

### updateContent

▸ **updateContent**(`id`, `updateData`): `Promise`\<``null`` \| [`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)\>

Updates a content record and returns the updated version.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |
| `updateData` | `Partial`\<[`NewContent`](models_Content.md#newcontent)\> |

#### Returns

`Promise`\<``null`` \| [`ContentApplicationData`](../interfaces/models_Content.ContentApplicationData.md)\>

#### Defined in

[server/src/models/Content.ts:175](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/Content.ts#L175)
