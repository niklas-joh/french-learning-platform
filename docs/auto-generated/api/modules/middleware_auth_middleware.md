[server](../README.md) / [Exports](../modules.md) / middleware/auth.middleware

# Module: middleware/auth.middleware

## Table of contents

### Interfaces

- [AuthenticatedRequest](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md)

### Functions

- [protect](middleware_auth_middleware.md#protect)

## Functions

### protect

▸ **protect**(`req`, `res`, `next`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |
| `next` | `NextFunction` |

#### Returns

`void`

#### Defined in

[server/src/middleware/auth.middleware.ts:20](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/middleware/auth.middleware.ts#L20)
