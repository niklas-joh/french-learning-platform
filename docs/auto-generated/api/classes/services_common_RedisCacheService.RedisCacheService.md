[server](../README.md) / [Exports](../modules.md) / [services/common/RedisCacheService](../modules/services_common_RedisCacheService.md) / RedisCacheService

# Class: RedisCacheService

[services/common/RedisCacheService](../modules/services_common_RedisCacheService.md).RedisCacheService

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

## Implements

- [`ICacheService`](../interfaces/services_common_ICacheService.ICacheService.md)

## Table of contents

### Constructors

- [constructor](services_common_RedisCacheService.RedisCacheService.md#constructor)

### Properties

- [client](services_common_RedisCacheService.RedisCacheService.md#client)

### Methods

- [clear](services_common_RedisCacheService.RedisCacheService.md#clear)
- [delete](services_common_RedisCacheService.RedisCacheService.md#delete)
- [get](services_common_RedisCacheService.RedisCacheService.md#get)
- [set](services_common_RedisCacheService.RedisCacheService.md#set)

## Constructors

### constructor

• **new RedisCacheService**(): [`RedisCacheService`](services_common_RedisCacheService.RedisCacheService.md)

#### Returns

[`RedisCacheService`](services_common_RedisCacheService.RedisCacheService.md)

#### Defined in

[server/src/services/common/RedisCacheService.ts:16](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/RedisCacheService.ts#L16)

## Properties

### client

• `Private` **client**: ``null`` \| `Redis`

#### Defined in

[server/src/services/common/RedisCacheService.ts:14](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/RedisCacheService.ts#L14)

## Methods

### clear

▸ **clear**(): `Promise`\<`void`\>

Clears the entire cache.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the cache has been cleared.

#### Implementation of

[ICacheService](../interfaces/services_common_ICacheService.ICacheService.md).[clear](../interfaces/services_common_ICacheService.ICacheService.md#clear)

#### Defined in

[server/src/services/common/RedisCacheService.ts:58](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/RedisCacheService.ts#L58)

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

#### Implementation of

[ICacheService](../interfaces/services_common_ICacheService.ICacheService.md).[delete](../interfaces/services_common_ICacheService.ICacheService.md#delete)

#### Defined in

[server/src/services/common/RedisCacheService.ts:51](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/RedisCacheService.ts#L51)

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

#### Implementation of

[ICacheService](../interfaces/services_common_ICacheService.ICacheService.md).[get](../interfaces/services_common_ICacheService.ICacheService.md#get)

#### Defined in

[server/src/services/common/RedisCacheService.ts:20](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/RedisCacheService.ts#L20)

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

#### Implementation of

[ICacheService](../interfaces/services_common_ICacheService.ICacheService.md).[set](../interfaces/services_common_ICacheService.ICacheService.md#set)

#### Defined in

[server/src/services/common/RedisCacheService.ts:39](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/common/RedisCacheService.ts#L39)
