[server](../README.md) / [Exports](../modules.md) / controllers/gamificationController

# Module: controllers/gamificationController

## Table of contents

### Functions

- [checkNewAchievements](controllers_gamificationController.md#checknewachievements)
- [getAllAchievements](controllers_gamificationController.md#getallachievements)
- [getUserAchievements](controllers_gamificationController.md#getuserachievements)

## Functions

### checkNewAchievements

▸ **checkNewAchievements**(`req`, `res`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/gamificationController.ts:46](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/gamificationController.ts#L46)

___

### getAllAchievements

▸ **getAllAchievements**(`req`, `res`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/gamificationController.ts:37](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/gamificationController.ts#L37)

___

### getUserAchievements

▸ **getUserAchievements**(`req`, `res`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AuthenticatedRequest`](../interfaces/middleware_auth_middleware.AuthenticatedRequest.md) |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/gamificationController.ts:23](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/gamificationController.ts#L23)
