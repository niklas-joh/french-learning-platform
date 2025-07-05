[server](../README.md) / [Exports](../modules.md) / [utils/logger](../modules/utils_logger.md) / ILogger

# Interface: ILogger

[utils/logger](../modules/utils_logger.md).ILogger

ILogger

**`Description`**

Defines a simple interface for a logger.

**`Todo`**

Replace with a full-featured structured logger like Pino (Future Consideration #16).

## Table of contents

### Methods

- [debug](utils_logger.ILogger.md#debug)
- [error](utils_logger.ILogger.md#error)
- [info](utils_logger.ILogger.md#info)
- [warn](utils_logger.ILogger.md#warn)

## Methods

### debug

▸ **debug**(`message`, `...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `...args` | `unknown`[] |

#### Returns

`void`

#### Defined in

[server/src/utils/logger.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/utils/logger.ts#L12)

___

### error

▸ **error**(`message`, `...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `...args` | `unknown`[] |

#### Returns

`void`

#### Defined in

[server/src/utils/logger.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/utils/logger.ts#L11)

___

### info

▸ **info**(`message`, `...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `...args` | `unknown`[] |

#### Returns

`void`

#### Defined in

[server/src/utils/logger.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/utils/logger.ts#L9)

___

### warn

▸ **warn**(`message`, `...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `...args` | `unknown`[] |

#### Returns

`void`

#### Defined in

[server/src/utils/logger.ts:10](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/utils/logger.ts#L10)
