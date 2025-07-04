[server](../README.md) / [Exports](../modules.md) / models/User

# Module: models/User

## Table of contents

### Classes

- [User](../classes/models_User.User.md)

### Interfaces

- [UserApplicationData](../interfaces/models_User.UserApplicationData.md)
- [UserSchema](../interfaces/models_User.UserSchema.md)

### Type Aliases

- [NewUser](models_User.md#newuser)

### Functions

- [createUser](models_User.md#createuser)
- [getAllUsers](models_User.md#getallusers)
- [getInternalUserByEmailWithPassword](models_User.md#getinternaluserbyemailwithpassword)
- [getTotalUsers](models_User.md#gettotalusers)
- [getUserByEmail](models_User.md#getuserbyemail)
- [getUserById](models_User.md#getuserbyid)
- [getUsersByRole](models_User.md#getusersbyrole)
- [updateUser](models_User.md#updateuser)

## Type Aliases

### NewUser

Ƭ **NewUser**: `Omit`\<[`UserSchema`](../interfaces/models_User.UserSchema.md), ``"id"`` \| ``"createdAt"`` \| ``"role"`` \| ``"preferences"``\> & \{ `firstName?`: `string` ; `lastName?`: `string` ; `preferences?`: `any` ; `role?`: `string`  }

#### Defined in

[server/src/models/User.ts:35](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L35)

## Functions

### createUser

▸ **createUser**(`userData`): `Promise`\<[`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)\>

Inserts a new user record and returns it in application data format.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userData` | [`NewUser`](models_User.md#newuser) |

#### Returns

`Promise`\<[`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)\>

#### Defined in

[server/src/models/User.ts:110](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L110)

___

### getAllUsers

▸ **getAllUsers**(): `Promise`\<[`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)[]\>

Fetches all users.

#### Returns

`Promise`\<[`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)[]\>

#### Defined in

[server/src/models/User.ts:156](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L156)

___

### getInternalUserByEmailWithPassword

▸ **getInternalUserByEmailWithPassword**(`email`): `Promise`\<``null`` \| [`UserSchema`](../interfaces/models_User.UserSchema.md)\>

Looks up a user by email but returns the raw database schema including the
password hash. Used internally for authentication checks.
The knex-stringcase mapper will automatically convert the column names.

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`\<``null`` \| [`UserSchema`](../interfaces/models_User.UserSchema.md)\>

#### Defined in

[server/src/models/User.ts:87](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L87)

___

### getTotalUsers

▸ **getTotalUsers**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[server/src/models/User.ts:161](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L161)

___

### getUserByEmail

▸ **getUserByEmail**(`email`): `Promise`\<``null`` \| [`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)\>

Looks up a user by email and maps the result to application data shape.

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`\<``null`` \| [`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)\>

#### Defined in

[server/src/models/User.ts:73](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L73)

___

### getUserById

▸ **getUserById**(`id`): `Promise`\<``null`` \| [`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)\>

Fetches a user by primary key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`Promise`\<``null`` \| [`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)\>

#### Defined in

[server/src/models/User.ts:99](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L99)

___

### getUsersByRole

▸ **getUsersByRole**(): `Promise`\<\{ `count`: `number` ; `role`: `string`  }[]\>

#### Returns

`Promise`\<\{ `count`: `number` ; `role`: `string`  }[]\>

#### Defined in

[server/src/models/User.ts:166](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L166)

___

### updateUser

▸ **updateUser**(`id`, `userData`): `Promise`\<``null`` \| [`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)\>

Updates an existing user record and returns it in application data format.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |
| `userData` | `Partial`\<[`NewUser`](models_User.md#newuser)\> |

#### Returns

`Promise`\<``null`` \| [`UserApplicationData`](../interfaces/models_User.UserApplicationData.md)\>

#### Defined in

[server/src/models/User.ts:130](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L130)
