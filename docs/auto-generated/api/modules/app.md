[server](../README.md) / [Exports](../modules.md) / app

# Module: app

## Table of contents

### Variables

- [server](app.md#server)

### Functions

- [app](app.md#app)

## Variables

### server

• `Const` **server**: `Server`\<typeof `IncomingMessage`, typeof `ServerResponse`\>

#### Defined in

[server/src/app.ts:55](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/app.ts#L55)

## Functions

### app

▸ **app**(`req`, `res`): `any`

Express instance itself is a request handler, which could be invoked without
third argument.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `IncomingMessage` \| `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `ServerResponse`\<`IncomingMessage`\> \| `Response`\<`any`, `Record`\<`string`, `any`\>, `number`\> |

#### Returns

`any`

#### Defined in

[server/src/app.ts:23](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/app.ts#L23)

▸ **app**(`req`, `res`, `next`): `void` \| `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\> |
| `res` | `Response`\<`any`, `Record`\<`string`, `any`\>, `number`\> |
| `next` | `NextFunction` |

#### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[server/src/app.ts:23](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/app.ts#L23)
