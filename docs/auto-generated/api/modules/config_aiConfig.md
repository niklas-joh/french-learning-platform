[server](../README.md) / [Exports](../modules.md) / config/aiConfig

# Module: config/aiConfig

## Table of contents

### Type Aliases

- [AIConfig](config_aiConfig.md#aiconfig)

### Variables

- [aiConfig](config_aiConfig.md#aiconfig-1)

## Type Aliases

### AIConfig

Ƭ **AIConfig**: typeof [`aiConfig`](config_aiConfig.md#aiconfig-1)

#### Defined in

[server/src/config/aiConfig.ts:26](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/config/aiConfig.ts#L26)

## Variables

### aiConfig

• `Const` **aiConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cost` | \{ `alertThreshold`: ``0.8`` = 0.8; `budgetPerMonth`: `number`  } |
| `cost.alertThreshold` | ``0.8`` |
| `cost.budgetPerMonth` | `number` |
| `openai` | \{ `apiKey`: `string` ; `defaultModel`: ``"gpt-3.5-turbo"`` = 'gpt-3.5-turbo'; `maxRetries`: ``3`` = 3; `timeout`: ``30000`` = 30000 } |
| `openai.apiKey` | `string` |
| `openai.defaultModel` | ``"gpt-3.5-turbo"`` |
| `openai.maxRetries` | ``3`` |
| `openai.timeout` | ``30000`` |
| `rateLimit` | \{ `maxRequests`: `number` ; `windowMs`: ``60000`` = 60000 } |
| `rateLimit.maxRequests` | `number` |
| `rateLimit.windowMs` | ``60000`` |
| `redis` | \{ `defaultTTL`: ``3600`` = 3600; `keyPrefix`: ``"french-ai:"`` = 'french-ai:'; `url`: `string`  } |
| `redis.defaultTTL` | ``3600`` |
| `redis.keyPrefix` | ``"french-ai:"`` |
| `redis.url` | `string` |

#### Defined in

[server/src/config/aiConfig.ts:4](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/config/aiConfig.ts#L4)
