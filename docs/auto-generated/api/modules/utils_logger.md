[server](../README.md) / [Exports](../modules.md) / utils/logger

# Module: utils/logger

## Table of contents

### Interfaces

- [ILogger](../interfaces/utils_logger.ILogger.md)

### Functions

- [createLogger](utils_logger.md#createlogger)

## Functions

### createLogger

▸ **createLogger**(`context`): [`ILogger`](../interfaces/utils_logger.ILogger.md)

Creates a basic logger instance that prefixes messages.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `string` | The context name to prefix logs with (e.g., 'AIOrchestrator'). |

#### Returns

[`ILogger`](../interfaces/utils_logger.ILogger.md)

An ILogger instance.

#### Defined in

[server/src/utils/logger.ts:20](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/utils/logger.ts#L20)
