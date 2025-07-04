[server](../README.md) / [Exports](../modules.md) / controllers/auth.controller

# Module: controllers/auth.controller

## Table of contents

### Functions

- [login](controllers_auth_controller.md#login)
- [register](controllers_auth_controller.md#register)

## Functions

### login

▸ **login**(`req`, `res`): `Promise`\<`void`\>

Validates user credentials and returns a JWT token on success.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/auth.controller.ts:71](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/auth.controller.ts#L71)

___

### register

▸ **register**(`req`, `res`): `Promise`\<`void`\>

Registers a new user and returns a JWT token.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/auth.controller.ts:16](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/auth.controller.ts#L16)
