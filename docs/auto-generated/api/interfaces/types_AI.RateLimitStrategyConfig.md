[server](../README.md) / [Exports](../modules.md) / [types/AI](../modules/types_AI.md) / RateLimitStrategyConfig

# Interface: RateLimitStrategyConfig

[types/AI](../modules/types_AI.md).RateLimitStrategyConfig

**`Description`**

Configuration for AI request rate limiting with specific type constraints.

## Table of contents

### Properties

- [enabled](types_AI.RateLimitStrategyConfig.md#enabled)
- [maxRequests](types_AI.RateLimitStrategyConfig.md#maxrequests)
- [windowMinutes](types_AI.RateLimitStrategyConfig.md#windowminutes)

## Properties

### enabled

• **enabled**: `boolean`

Whether rate limiting is enabled

#### Defined in

[server/src/types/AI.ts:72](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L72)

___

### maxRequests

• **maxRequests**: `number`

Maximum requests allowed per window

#### Defined in

[server/src/types/AI.ts:76](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L76)

___

### windowMinutes

• **windowMinutes**: `number`

Time window for rate limiting in minutes

#### Defined in

[server/src/types/AI.ts:74](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L74)
