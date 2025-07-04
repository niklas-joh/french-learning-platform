[server](../README.md) / [Exports](../modules.md) / controllers/progressController

# Module: controllers/progressController

## Table of contents

### Functions

- [getUserProgress](controllers_progressController.md#getuserprogress)
- [getUserStreak](controllers_progressController.md#getuserstreak)
- [recordActivityCompleted](controllers_progressController.md#recordactivitycompleted)

## Functions

### getUserProgress

▸ **getUserProgress**(`req`, `res`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/progressController.ts:4](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/progressController.ts#L4)

___

### getUserStreak

▸ **getUserStreak**(`req`, `res`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/progressController.ts:15](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/progressController.ts#L15)

___

### recordActivityCompleted

▸ **recordActivityCompleted**(`req`, `res`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/progressController.ts:26](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/progressController.ts#L26)
