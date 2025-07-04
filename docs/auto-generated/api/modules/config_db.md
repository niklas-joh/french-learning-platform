[server](../README.md) / [Exports](../modules.md) / config/db

# Module: config/db

## Table of contents

### Functions

- [default](config_db.md#default)

## Functions

### default

▸ **default**\<`TTable`\>(`tableName`, `options?`): `QueryBuilder`\<`TableType`\<`TTable`\>, `DeferredKeySelection`\<`ResolveTableType`\<`TableType`\<`TTable`\>, ``"base"``\>, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTable` | extends `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `TTable` |
| `options?` | `PgTableOptions` |

#### Returns

`QueryBuilder`\<`TableType`\<`TTable`\>, `DeferredKeySelection`\<`ResolveTableType`\<`TableType`\<`TTable`\>, ``"base"``\>, `never`, ``false``, {}, ``false``, {}, `never`\>[]\>

#### Defined in

[server/src/config/db.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/config/db.ts#L11)

▸ **default**\<`TRecord2`, `TResult2`\>(`tableName?`, `options?`): `QueryBuilder`\<`TRecord2`, `TResult2`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRecord2` | extends `Object` = `any` |
| `TResult2` | `DeferredKeySelection`\<`TRecord2`, `never`, ``false``, {}, ``false``, {}, `never`\>[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName?` | `TableDescriptor` \| `AliasDict` |
| `options?` | `PgTableOptions` |

#### Returns

`QueryBuilder`\<`TRecord2`, `TResult2`\>

#### Defined in

[server/src/config/db.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/config/db.ts#L11)
