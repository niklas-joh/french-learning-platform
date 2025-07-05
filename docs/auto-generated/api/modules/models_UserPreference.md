[server](../README.md) / [Exports](../modules.md) / models/UserPreference

# Module: models/UserPreference

## Table of contents

### Interfaces

- [UserPreference](../interfaces/models_UserPreference.UserPreference.md)

### Variables

- [default](models_UserPreference.md#default)

## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `findByUserId` | (`userId`: `number`) => `Promise`\<`undefined` \| [`UserPreference`](../interfaces/models_UserPreference.UserPreference.md)\> |
| `upsert` | (`userId`: `number`, `preferences`: `object`) => `Promise`\<[`UserPreference`](../interfaces/models_UserPreference.UserPreference.md)\> |

#### Defined in

[server/src/models/UserPreference.ts:43](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/UserPreference.ts#L43)
