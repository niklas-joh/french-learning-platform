[server](../README.md) / [Exports](../modules.md) / models/ContentType

# Module: models/ContentType

## Table of contents

### Interfaces

- [ContentType](../interfaces/models_ContentType.ContentType.md)

### Functions

- [createContentType](models_ContentType.md#createcontenttype)
- [deleteContentType](models_ContentType.md#deletecontenttype)
- [getAllContentTypes](models_ContentType.md#getallcontenttypes)
- [updateContentType](models_ContentType.md#updatecontenttype)

## Functions

### createContentType

▸ **createContentType**(`contentType`): `Promise`\<[`ContentType`](../interfaces/models_ContentType.ContentType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | `Omit`\<[`ContentType`](../interfaces/models_ContentType.ContentType.md), ``"id"``\> |

#### Returns

`Promise`\<[`ContentType`](../interfaces/models_ContentType.ContentType.md)\>

#### Defined in

[server/src/models/ContentType.ts:13](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/ContentType.ts#L13)

___

### deleteContentType

▸ **deleteContentType**(`id`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[server/src/models/ContentType.ts:24](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/ContentType.ts#L24)

___

### getAllContentTypes

▸ **getAllContentTypes**(): `Promise`\<[`ContentType`](../interfaces/models_ContentType.ContentType.md)[]\>

#### Returns

`Promise`\<[`ContentType`](../interfaces/models_ContentType.ContentType.md)[]\>

#### Defined in

[server/src/models/ContentType.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/ContentType.ts#L9)

___

### updateContentType

▸ **updateContentType**(`id`, `contentType`): `Promise`\<``null`` \| [`ContentType`](../interfaces/models_ContentType.ContentType.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |
| `contentType` | `Partial`\<[`ContentType`](../interfaces/models_ContentType.ContentType.md)\> |

#### Returns

`Promise`\<``null`` \| [`ContentType`](../interfaces/models_ContentType.ContentType.md)\>

#### Defined in

[server/src/models/ContentType.ts:18](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/ContentType.ts#L18)
