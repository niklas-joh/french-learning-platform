[server](../README.md) / [Exports](../modules.md) / [types/ILogger](../modules/types_ILogger.md) / ILogger

# Interface: ILogger

[types/ILogger](../modules/types_ILogger.md).ILogger

**`File`**

ILogger.ts

**`Description`**

Defines a generic logger interface to support structured logging.

This abstraction allows for different logging implementations (e.g., console, Pino, Winston)
to be used without changing the application code that uses the logger.

**`See`**

Future Implementation #16 - Implement Structured Logging

## Table of contents

### Methods

- [debug](types_ILogger.ILogger.md#debug)
- [error](types_ILogger.ILogger.md#error)
- [info](types_ILogger.ILogger.md#info)
- [warn](types_ILogger.ILogger.md#warn)

## Methods

### debug

▸ **debug**(`message`, `...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[server/src/types/ILogger.ts:15](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/ILogger.ts#L15)

___

### error

▸ **error**(`message`, `...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[server/src/types/ILogger.ts:14](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/ILogger.ts#L14)

___

### info

▸ **info**(`message`, `...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[server/src/types/ILogger.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/ILogger.ts#L12)

___

### warn

▸ **warn**(`message`, `...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[server/src/types/ILogger.ts:13](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/types/ILogger.ts#L13)
