[server](../README.md) / [Exports](../modules.md) / controllers/admin.controller

# Module: controllers/admin.controller

## Table of contents

### Functions

- [adminTestController](controllers_admin_controller.md#admintestcontroller)
- [createContentItem](controllers_admin_controller.md#createcontentitem)
- [createContentType](controllers_admin_controller.md#createcontenttype)
- [createTopic](controllers_admin_controller.md#createtopic)
- [deleteContentItemById](controllers_admin_controller.md#deletecontentitembyid)
- [deleteContentType](controllers_admin_controller.md#deletecontenttype)
- [deleteTopicById](controllers_admin_controller.md#deletetopicbyid)
- [getAllContentItems](controllers_admin_controller.md#getallcontentitems)
- [getAllContentTypes](controllers_admin_controller.md#getallcontenttypes)
- [getAllTopics](controllers_admin_controller.md#getalltopics)
- [getAllUsers](controllers_admin_controller.md#getallusers)
- [getAnalyticsSummary](controllers_admin_controller.md#getanalyticssummary)
- [getContentItemById](controllers_admin_controller.md#getcontentitembyid)
- [getTopicById](controllers_admin_controller.md#gettopicbyid)
- [updateContentItemById](controllers_admin_controller.md#updatecontentitembyid)
- [updateContentType](controllers_admin_controller.md#updatecontenttype)
- [updateTopicById](controllers_admin_controller.md#updatetopicbyid)

## Functions

### adminTestController

▸ **adminTestController**(`req`, `res`): `void`

Simple endpoint used by tests to verify that admin routes are reachable.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`void`

#### Defined in

[server/src/controllers/admin.controller.ts:21](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L21)

___

### createContentItem

▸ **createContentItem**(`req`, `res`): `Promise`\<`void`\>

Creates a new content item entry.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:233](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L233)

___

### createContentType

▸ **createContentType**(`req`, `res`): `Promise`\<`void`\>

Creates a new content type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:178](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L178)

___

### createTopic

▸ **createTopic**(`req`, `res`): `Promise`\<`void`\>

Creates a new topic entry.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:94](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L94)

___

### deleteContentItemById

▸ **deleteContentItemById**(`req`, `res`): `Promise`\<`void`\>

Deletes a content item.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:295](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L295)

___

### deleteContentType

▸ **deleteContentType**(`req`, `res`): `Promise`\<`void`\>

Removes a content type from the system.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:215](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L215)

___

### deleteTopicById

▸ **deleteTopicById**(`req`, `res`): `Promise`\<`void`\>

Deletes a topic from the database.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:147](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L147)

___

### getAllContentItems

▸ **getAllContentItems**(`_req`, `res`): `Promise`\<`void`\>

Fetches all content items.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:246](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L246)

___

### getAllContentTypes

▸ **getAllContentTypes**(`_req`, `res`): `Promise`\<`void`\>

Returns the list of configured content types.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:165](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L165)

___

### getAllTopics

▸ **getAllTopics**(`_req`, `res`): `Promise`\<`void`\>

Fetches all topics available in the system.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:81](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L81)

___

### getAllUsers

▸ **getAllUsers**(`_req`, `res`): `Promise`\<`void`\>

Retrieves a list of all users in the system.

#### Parameters

| Name | Type |
| :------ | :------ |
| `_req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:313](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L313)

___

### getAnalyticsSummary

▸ **getAnalyticsSummary**(`req`, `res`): `Promise`\<`void`\>

Returns a high level analytics summary of the application.

Currently counts users and basic content items. File system reads are used
to approximate the total amount of content available.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:31](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L31)

___

### getContentItemById

▸ **getContentItemById**(`req`, `res`): `Promise`\<`void`\>

Returns a single content item by id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:259](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L259)

___

### getTopicById

▸ **getTopicById**(`req`, `res`): `Promise`\<`void`\>

Retrieves a single topic by its id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:114](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L114)

___

### updateContentItemById

▸ **updateContentItemById**(`req`, `res`): `Promise`\<`void`\>

Updates a content item identified by id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:277](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L277)

___

### updateContentType

▸ **updateContentType**(`req`, `res`): `Promise`\<`void`\>

Updates an existing content type record.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:196](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L196)

___

### updateTopicById

▸ **updateTopicById**(`req`, `res`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/src/controllers/admin.controller.ts:129](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/controllers/admin.controller.ts#L129)
