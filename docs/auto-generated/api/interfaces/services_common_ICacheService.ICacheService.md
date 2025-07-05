[server](../README.md) / [Exports](../modules.md) / [services/common/ICacheService](../modules/services_common_ICacheService.md) / ICacheService

# Interface: ICacheService

[services/common/ICacheService](../modules/services_common_ICacheService.md).ICacheService

**`File`**

ICacheService.ts

**`Description`**

Defines the interface for a generic caching service.

This interface abstracts the underlying caching mechanism (e.g., Redis, in-memory),
allowing different implementations to be used interchangeably throughout the application.
It adheres to the Dependency Inversion Principle.

**`See`**

 - Future Implementation #14 - Abstract Service Dependencies with Interfaces
 - Future Implementation #22 - Abstract Service Dependencies with Interfaces

## Implemented by

- [`RedisCacheService`](../classes/services_common_RedisCacheService.RedisCacheService.md)

## Table of contents

### Methods

- [clear](services_common_ICacheService.ICacheService.md#clear)
- [delete](services_common_ICacheService.ICacheService.md#delete)
- [get](services_common_ICacheService.ICacheService.md#get)
- [set](services_common_ICacheService.ICacheService.md#set)

## Methods

### clear

▸ **clear**(): `Promise`\<`void`\>

Clears the entire cache.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the cache has been cleared.

#### Defined in

[server/src/services/common/ICacheService.ts:41](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/ICacheService.ts#L41)

___

### delete

▸ **delete**(`key`): `Promise`\<`void`\>

Deletes an item from the cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key of the item to delete. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the item has been deleted.

#### Defined in

[server/src/services/common/ICacheService.ts:35](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/ICacheService.ts#L35)

___

### get

▸ **get**\<`T`\>(`key`): `Promise`\<``null`` \| `T`\>

Retrieves an item from the cache.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key of the item to retrieve. |

#### Returns

`Promise`\<``null`` \| `T`\>

A promise that resolves to the cached item, or null if the item is not found.

#### Defined in

[server/src/services/common/ICacheService.ts:19](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/ICacheService.ts#L19)

___

### set

▸ **set**\<`T`\>(`key`, `value`, `ttlSeconds?`): `Promise`\<`void`\>

Stores an item in the cache.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key to store the item under. |
| `value` | `T` | The item to store. |
| `ttlSeconds?` | `number` | The time-to-live for the item in seconds (optional). |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the item has been stored.

#### Defined in

[server/src/services/common/ICacheService.ts:28](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/ICacheService.ts#L28)
