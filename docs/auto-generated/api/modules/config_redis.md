[server](../README.md) / [Exports](../modules.md) / config/redis

# Module: config/redis

## Table of contents

### Variables

- [QUEUE\_NAMES](config_redis.md#queue_names)
- [isRedisEnabled](config_redis.md#isredisenabled)
- [redisConnection](config_redis.md#redisconnection)

## Variables

### QUEUE\_NAMES

• `Const` **QUEUE\_NAMES**: `Object`

Centralized queue names to prevent typos and ensure consistency.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CONTENT_GENERATION` | `string` |

#### Defined in

[server/src/config/redis.ts:24](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/config/redis.ts#L24)

___

### isRedisEnabled

• `Const` **isRedisEnabled**: `boolean`

#### Defined in

[server/src/config/redis.ts:4](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/config/redis.ts#L4)

___

### redisConnection

• `Const` **redisConnection**: ``null`` \| `Redis`

Singleton instance of the IORedis connection.
This connection is only created if Redis is enabled.

#### Defined in

[server/src/config/redis.ts:19](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/config/redis.ts#L19)
