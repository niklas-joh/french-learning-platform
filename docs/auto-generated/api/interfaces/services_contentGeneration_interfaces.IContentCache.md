[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IContentCache

# Interface: IContentCache

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IContentCache

Interface for caching generated content
TODO: Reference Future Implementation #10 - AI Response Caching Strategy

## Table of contents

### Methods

- [clear](services_contentGeneration_interfaces.IContentCache.md#clear)
- [delete](services_contentGeneration_interfaces.IContentCache.md#delete)
- [get](services_contentGeneration_interfaces.IContentCache.md#get)
- [set](services_contentGeneration_interfaces.IContentCache.md#set)

## Methods

### clear

▸ **clear**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:92](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L92)

___

### delete

▸ **delete**(`key`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:91](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L91)

___

### get

▸ **get**(`key`): `Promise`\<``null`` \| [`GeneratedContent`](types_Content.GeneratedContent.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<``null`` \| [`GeneratedContent`](types_Content.GeneratedContent.md)\>

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:89](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L89)

___

### set

▸ **set**(`key`, `content`, `ttl?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `content` | [`GeneratedContent`](types_Content.GeneratedContent.md) |
| `ttl?` | `number` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:90](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/contentGeneration/interfaces.ts#L90)
