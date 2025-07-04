[server](../README.md) / [Exports](../modules.md) / controllers/user.controller

# Module: controllers/user.controller

## Table of contents

### Functions

- [getAllUsers](controllers_user_controller.md#getallusers)
- [getAssignedContent](controllers_user_controller.md#getassignedcontent)
- [getCurrentUserProfile](controllers_user_controller.md#getcurrentuserprofile)
- [getUserPreferences](controllers_user_controller.md#getuserpreferences)
- [getUserProgress](controllers_user_controller.md#getuserprogress)
- [recordContentItemProgress](controllers_user_controller.md#recordcontentitemprogress)
- [updateUserPreferences](controllers_user_controller.md#updateuserpreferences)
- [updateUserProfile](controllers_user_controller.md#updateuserprofile)

## Functions

### getAllUsers

▸ **getAllUsers**(`_req`, `res`): `Promise`\<`void`\>

Lists all users. Admin only endpoint.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/user.controller.ts:109](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/user.controller.ts#L109)

___

### getAssignedContent

▸ **getAssignedContent**(`req`, `res`): `Promise`\<`void`\>

Returns all content assignments for the authenticated user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `AuthenticatedRequest` |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/user.controller.ts:122](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/user.controller.ts#L122)

___

### getCurrentUserProfile

▸ **getCurrentUserProfile**(`req`, `res`): `Promise`\<`void`\>

Returns the authenticated user's profile without the password hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `AuthenticatedRequest` |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/user.controller.ts:27](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/user.controller.ts#L27)

___

### getUserPreferences

▸ **getUserPreferences**(`req`, `res`): `Promise`\<`void`\>

Retrieves the persisted preferences for the authenticated user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `AuthenticatedRequest` |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/user.controller.ts:172](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/user.controller.ts#L172)

___

### getUserProgress

▸ **getUserProgress**(`req`, `res`): `Promise`\<`void`\>

Aggregates progress for the authenticated user across all topics and assigned content.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `AuthenticatedRequest` |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/user.controller.ts:144](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/user.controller.ts#L144)

___

### recordContentItemProgress

▸ **recordContentItemProgress**(`req`, `res`): `Promise`\<`void`\>

Records progress for a specific content item for the authenticated user.
Sets the status of the corresponding user_content_assignment to 'completed'.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `AuthenticatedRequest` |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/user.controller.ts:222](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/user.controller.ts#L222)

___

### updateUserPreferences

▸ **updateUserPreferences**(`req`, `res`): `Promise`\<`void`\>

Stores new preference values for the authenticated user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `AuthenticatedRequest` |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/user.controller.ts:195](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/user.controller.ts#L195)

___

### updateUserProfile

▸ **updateUserProfile**(`req`, `res`): `Promise`\<`void`\>

Updates the authenticated user's profile fields.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `AuthenticatedRequest` |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/user.controller.ts:53](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/controllers/user.controller.ts#L53)
