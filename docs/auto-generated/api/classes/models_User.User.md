[server](../README.md) / [Exports](../modules.md) / [models/User](../modules/models_User.md) / User

# Class: User

[models/User](../modules/models_User.md).User

## Hierarchy

- `Model`

  ↳ **`User`**

## Table of contents

### Constructors

- [constructor](models_User.User.md#constructor)

### Properties

- [$modelClass](models_User.User.md#$modelclass)
- [QueryBuilderType](models_User.User.md#querybuildertype)
- [createdAt](models_User.User.md#createdat)
- [email](models_User.User.md#email)
- [firstName](models_User.User.md#firstname)
- [id](models_User.User.md#id)
- [lastName](models_User.User.md#lastname)
- [passwordHash](models_User.User.md#passwordhash)
- [preferences](models_User.User.md#preferences)
- [role](models_User.User.md#role)
- [updatedAt](models_User.User.md#updatedat)
- [BelongsToOneRelation](models_User.User.md#belongstoonerelation)
- [HasManyRelation](models_User.User.md#hasmanyrelation)
- [HasOneRelation](models_User.User.md#hasonerelation)
- [HasOneThroughRelation](models_User.User.md#hasonethroughrelation)
- [ManyToManyRelation](models_User.User.md#manytomanyrelation)
- [QueryBuilder](models_User.User.md#querybuilder)
- [columnNameMappers](models_User.User.md#columnnamemappers)
- [dbRefProp](models_User.User.md#dbrefprop)
- [defaultGraphOptions](models_User.User.md#defaultgraphoptions)
- [fn](models_User.User.md#fn)
- [idColumn](models_User.User.md#idcolumn)
- [jsonAttributes](models_User.User.md#jsonattributes)
- [jsonSchema](models_User.User.md#jsonschema)
- [modelPaths](models_User.User.md#modelpaths)
- [modifiers](models_User.User.md#modifiers)
- [pickJsonSchemaProperties](models_User.User.md#pickjsonschemaproperties)
- [propRefRegex](models_User.User.md#proprefregex)
- [raw](models_User.User.md#raw)
- [ref](models_User.User.md#ref)
- [relatedFindQueryMutates](models_User.User.md#relatedfindquerymutates)
- [relatedInsertQueryMutates](models_User.User.md#relatedinsertquerymutates)
- [relationMappings](models_User.User.md#relationmappings)
- [tableName](models_User.User.md#tablename)
- [uidProp](models_User.User.md#uidprop)
- [uidRefProp](models_User.User.md#uidrefprop)
- [useLimitInFirst](models_User.User.md#uselimitinfirst)
- [virtualAttributes](models_User.User.md#virtualattributes)

### Methods

- [$afterDelete](models_User.User.md#$afterdelete)
- [$afterFind](models_User.User.md#$afterfind)
- [$afterInsert](models_User.User.md#$afterinsert)
- [$afterUpdate](models_User.User.md#$afterupdate)
- [$afterValidate](models_User.User.md#$aftervalidate)
- [$appendRelated](models_User.User.md#$appendrelated)
- [$beforeDelete](models_User.User.md#$beforedelete)
- [$beforeInsert](models_User.User.md#$beforeinsert)
- [$beforeUpdate](models_User.User.md#$beforeupdate)
- [$beforeValidate](models_User.User.md#$beforevalidate)
- [$clone](models_User.User.md#$clone)
- [$fetchGraph](models_User.User.md#$fetchgraph)
- [$formatDatabaseJson](models_User.User.md#$formatdatabasejson)
- [$formatJson](models_User.User.md#$formatjson)
- [$id](models_User.User.md#$id)
- [$knex](models_User.User.md#$knex)
- [$omitFromDatabaseJson](models_User.User.md#$omitfromdatabasejson)
- [$omitFromJson](models_User.User.md#$omitfromjson)
- [$parseDatabaseJson](models_User.User.md#$parsedatabasejson)
- [$parseJson](models_User.User.md#$parsejson)
- [$query](models_User.User.md#$query)
- [$relatedQuery](models_User.User.md#$relatedquery)
- [$set](models_User.User.md#$set)
- [$setDatabaseJson](models_User.User.md#$setdatabasejson)
- [$setJson](models_User.User.md#$setjson)
- [$setRelated](models_User.User.md#$setrelated)
- [$toDatabaseJson](models_User.User.md#$todatabasejson)
- [$toJson](models_User.User.md#$tojson)
- [$transaction](models_User.User.md#$transaction)
- [$traverse](models_User.User.md#$traverse)
- [$traverseAsync](models_User.User.md#$traverseasync)
- [$validate](models_User.User.md#$validate)
- [toJSON](models_User.User.md#tojson)
- [afterDelete](models_User.User.md#afterdelete)
- [afterFind](models_User.User.md#afterfind)
- [afterInsert](models_User.User.md#afterinsert)
- [afterUpdate](models_User.User.md#afterupdate)
- [beforeDelete](models_User.User.md#beforedelete)
- [beforeFind](models_User.User.md#beforefind)
- [beforeInsert](models_User.User.md#beforeinsert)
- [beforeUpdate](models_User.User.md#beforeupdate)
- [bindKnex](models_User.User.md#bindknex)
- [bindTransaction](models_User.User.md#bindtransaction)
- [columnNameToPropertyName](models_User.User.md#columnnametopropertyname)
- [createNotFoundError](models_User.User.md#createnotfounderror)
- [createValidationError](models_User.User.md#createvalidationerror)
- [createValidator](models_User.User.md#createvalidator)
- [fetchGraph](models_User.User.md#fetchgraph)
- [fetchTableMetadata](models_User.User.md#fetchtablemetadata)
- [fromDatabaseJson](models_User.User.md#fromdatabasejson)
- [fromJson](models_User.User.md#fromjson)
- [getRelation](models_User.User.md#getrelation)
- [getRelations](models_User.User.md#getrelations)
- [knex](models_User.User.md#knex)
- [knexQuery](models_User.User.md#knexquery)
- [propertyNameToColumnName](models_User.User.md#propertynametocolumnname)
- [query](models_User.User.md#query)
- [relatedQuery](models_User.User.md#relatedquery)
- [startTransaction](models_User.User.md#starttransaction)
- [tableMetadata](models_User.User.md#tablemetadata)
- [transaction](models_User.User.md#transaction)
- [traverse](models_User.User.md#traverse)
- [traverseAsync](models_User.User.md#traverseasync)

## Constructors

### constructor

• **new User**(): [`User`](models_User.User.md)

#### Returns

[`User`](models_User.User.md)

#### Inherited from

Model.constructor

## Properties

### $modelClass

• **$modelClass**: `ModelClass`\<[`User`](models_User.User.md)\>

#### Inherited from

Model.$modelClass

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1664

___

### QueryBuilderType

• **QueryBuilderType**: `QueryBuilder`\<[`User`](models_User.User.md), [`User`](models_User.User.md)[]\>

#### Inherited from

Model.QueryBuilderType

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1733

___

### createdAt

• **createdAt**: `string`

#### Defined in

[server/src/models/User.ts:16](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L16)

___

### email

• **email**: `string`

#### Defined in

[server/src/models/User.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L11)

___

### firstName

• `Optional` **firstName**: ``null`` \| `string`

#### Defined in

[server/src/models/User.ts:13](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L13)

___

### id

• **id**: `number`

#### Defined in

[server/src/models/User.ts:10](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L10)

___

### lastName

• `Optional` **lastName**: ``null`` \| `string`

#### Defined in

[server/src/models/User.ts:14](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L14)

___

### passwordHash

• **passwordHash**: `string`

#### Defined in

[server/src/models/User.ts:12](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L12)

___

### preferences

• `Optional` **preferences**: ``null`` \| `string`

#### Defined in

[server/src/models/User.ts:18](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L18)

___

### role

• **role**: `string`

#### Defined in

[server/src/models/User.ts:15](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L15)

___

### updatedAt

• `Optional` **updatedAt**: `string`

#### Defined in

[server/src/models/User.ts:17](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L17)

___

### BelongsToOneRelation

▪ `Static` **BelongsToOneRelation**: `RelationType`

#### Inherited from

Model.BelongsToOneRelation

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1575

___

### HasManyRelation

▪ `Static` **HasManyRelation**: `RelationType`

#### Inherited from

Model.HasManyRelation

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1577

___

### HasOneRelation

▪ `Static` **HasOneRelation**: `RelationType`

#### Inherited from

Model.HasOneRelation

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1576

___

### HasOneThroughRelation

▪ `Static` **HasOneThroughRelation**: `RelationType`

#### Inherited from

Model.HasOneThroughRelation

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1579

___

### ManyToManyRelation

▪ `Static` **ManyToManyRelation**: `RelationType`

#### Inherited from

Model.ManyToManyRelation

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1578

___

### QueryBuilder

▪ `Static` **QueryBuilder**: typeof `QueryBuilder`

#### Inherited from

Model.QueryBuilder

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1551

___

### columnNameMappers

▪ `Static` **columnNameMappers**: `ColumnNameMappers`

#### Inherited from

Model.columnNameMappers

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1569

___

### dbRefProp

▪ `Static` **dbRefProp**: `string`

#### Inherited from

Model.dbRefProp

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1562

___

### defaultGraphOptions

▪ `Static` `Optional` **defaultGraphOptions**: `GraphOptions`

#### Inherited from

Model.defaultGraphOptions

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1581

___

### fn

▪ `Static` **fn**: `FunctionFunction`

#### Inherited from

Model.fn

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1573

___

### idColumn

▪ `Static` **idColumn**: `string` \| `string`[]

#### Inherited from

Model.idColumn

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1554

___

### jsonAttributes

▪ `Static` **jsonAttributes**: `string`[]

#### Inherited from

Model.jsonAttributes

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1558

___

### jsonSchema

▪ `Static` **jsonSchema**: `JSONSchema`

#### Inherited from

Model.jsonSchema

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1555

___

### modelPaths

▪ `Static` **modelPaths**: `string`[]

#### Inherited from

Model.modelPaths

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1557

___

### modifiers

▪ `Static` **modifiers**: `Modifiers`\<`AnyQueryBuilder`\>

#### Inherited from

Model.modifiers

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1568

___

### pickJsonSchemaProperties

▪ `Static` **pickJsonSchemaProperties**: `boolean`

#### Inherited from

Model.pickJsonSchemaProperties

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1564

___

### propRefRegex

▪ `Static` **propRefRegex**: `RegExp`

#### Inherited from

Model.propRefRegex

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1563

___

### raw

▪ `Static` **raw**: `RawFunction`

#### Inherited from

Model.raw

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1571

___

### ref

▪ `Static` **ref**: `ReferenceFunction`

#### Inherited from

Model.ref

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1572

___

### relatedFindQueryMutates

▪ `Static` **relatedFindQueryMutates**: `boolean`

#### Inherited from

Model.relatedFindQueryMutates

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1565

___

### relatedInsertQueryMutates

▪ `Static` **relatedInsertQueryMutates**: `boolean`

#### Inherited from

Model.relatedInsertQueryMutates

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1566

___

### relationMappings

▪ `Static` **relationMappings**: `RelationMappings` \| `RelationMappingsThunk`

#### Inherited from

Model.relationMappings

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1556

___

### tableName

▪ `Static` **tableName**: `string` = `'users'`

#### Overrides

Model.tableName

#### Defined in

[server/src/models/User.ts:8](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/models/User.ts#L8)

___

### uidProp

▪ `Static` **uidProp**: `string`

#### Inherited from

Model.uidProp

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1560

___

### uidRefProp

▪ `Static` **uidRefProp**: `string`

#### Inherited from

Model.uidRefProp

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1561

___

### useLimitInFirst

▪ `Static` **useLimitInFirst**: `boolean`

#### Inherited from

Model.useLimitInFirst

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1567

___

### virtualAttributes

▪ `Static` **virtualAttributes**: `string`[]

#### Inherited from

Model.virtualAttributes

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1559

## Methods

### $afterDelete

▸ **$afterDelete**(`queryContext`): `void` \| `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryContext` | `QueryContext` |

#### Returns

`void` \| `Promise`\<`any`\>

#### Inherited from

Model.$afterDelete

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1702

___

### $afterFind

▸ **$afterFind**(`queryContext`): `void` \| `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryContext` | `QueryContext` |

#### Returns

`void` \| `Promise`\<`any`\>

#### Inherited from

Model.$afterFind

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1700

___

### $afterInsert

▸ **$afterInsert**(`queryContext`): `void` \| `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryContext` | `QueryContext` |

#### Returns

`void` \| `Promise`\<`any`\>

#### Inherited from

Model.$afterInsert

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1697

___

### $afterUpdate

▸ **$afterUpdate**(`opt`, `queryContext`): `void` \| `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt` | `ModelOptions` |
| `queryContext` | `QueryContext` |

#### Returns

`void` \| `Promise`\<`any`\>

#### Inherited from

Model.$afterUpdate

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1698

___

### $afterValidate

▸ **$afterValidate**(`json`, `opt`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Pojo` |
| `opt` | `ModelOptions` |

#### Returns

`void`

#### Inherited from

Model.$afterValidate

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1694

___

### $appendRelated

▸ **$appendRelated**\<`RM`\>(`relation`, `related`): `this`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `RM` | extends `Model` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `relation` | `String` \| `Relation` |
| `related` | `undefined` \| ``null`` \| `RM` \| `RM`[] |

#### Returns

`this`

#### Inherited from

Model.$appendRelated

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1716

___

### $beforeDelete

▸ **$beforeDelete**(`queryContext`): `void` \| `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryContext` | `QueryContext` |

#### Returns

`void` \| `Promise`\<`any`\>

#### Inherited from

Model.$beforeDelete

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1701

___

### $beforeInsert

▸ **$beforeInsert**(`queryContext`): `void` \| `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryContext` | `QueryContext` |

#### Returns

`void` \| `Promise`\<`any`\>

#### Inherited from

Model.$beforeInsert

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1696

___

### $beforeUpdate

▸ **$beforeUpdate**(`opt`, `queryContext`): `void` \| `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt` | `ModelOptions` |
| `queryContext` | `QueryContext` |

#### Returns

`void` \| `Promise`\<`any`\>

#### Inherited from

Model.$beforeUpdate

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1699

___

### $beforeValidate

▸ **$beforeValidate**(`jsonSchema`, `json`, `opt`): `JSONSchema`

#### Parameters

| Name | Type |
| :------ | :------ |
| `jsonSchema` | `JSONSchema` |
| `json` | `Pojo` |
| `opt` | `ModelOptions` |

#### Returns

`JSONSchema`

#### Inherited from

Model.$beforeValidate

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1692

___

### $clone

▸ **$clone**(`opt?`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | `CloneOptions` |

#### Returns

`this`

#### Inherited from

Model.$clone

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1722

___

### $fetchGraph

▸ **$fetchGraph**(`expression`, `options?`): `QueryBuilder`\<[`User`](models_User.User.md), [`User`](models_User.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `expression` | `RelationExpression`\<`M`\> |
| `options?` | `FetchGraphOptions` |

#### Returns

`QueryBuilder`\<[`User`](models_User.User.md), [`User`](models_User.User.md)\>

#### Inherited from

Model.$fetchGraph

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1681

___

### $formatDatabaseJson

▸ **$formatDatabaseJson**(`json`): `Pojo`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Pojo` |

#### Returns

`Pojo`

#### Inherited from

Model.$formatDatabaseJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1686

___

### $formatJson

▸ **$formatJson**(`json`): `Pojo`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Pojo` |

#### Returns

`Pojo`

#### Inherited from

Model.$formatJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1689

___

### $id

▸ **$id**(`id`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |

#### Returns

`void`

#### Inherited from

Model.$id

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1678

▸ **$id**(): `any`

#### Returns

`any`

#### Inherited from

Model.$id

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1679

___

### $knex

▸ **$knex**(): `Knex`\<`any`, `any`[]\>

#### Returns

`Knex`\<`any`, `any`[]\>

#### Inherited from

Model.$knex

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1730

___

### $omitFromDatabaseJson

▸ **$omitFromDatabaseJson**(`keys`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string` \| `string`[] \| \{ `[key: string]`: `boolean`;  } |

#### Returns

`this`

#### Inherited from

Model.$omitFromDatabaseJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1728

___

### $omitFromJson

▸ **$omitFromJson**(`keys`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string` \| `string`[] \| \{ `[key: string]`: `boolean`;  } |

#### Returns

`this`

#### Inherited from

Model.$omitFromJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1727

___

### $parseDatabaseJson

▸ **$parseDatabaseJson**(`json`): `Pojo`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Pojo` |

#### Returns

`Pojo`

#### Inherited from

Model.$parseDatabaseJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1687

___

### $parseJson

▸ **$parseJson**(`json`, `opt?`): `Pojo`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Pojo` |
| `opt?` | `ModelOptions` |

#### Returns

`Pojo`

#### Inherited from

Model.$parseJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1690

___

### $query

▸ **$query**(`trxOrKnex?`): `QueryBuilder`\<[`User`](models_User.User.md), [`User`](models_User.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `trxOrKnex?` | `TransactionOrKnex` |

#### Returns

`QueryBuilder`\<[`User`](models_User.User.md), [`User`](models_User.User.md)\>

#### Inherited from

Model.$query

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1676

___

### $relatedQuery

▸ **$relatedQuery**\<`K`\>(`relationName`, `trxOrKnex?`): `RelatedQueryBuilder`\<[`User`](models_User.User.md)[`K`]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`User`](models_User.User.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `relationName` | `K` |
| `trxOrKnex?` | `TransactionOrKnex` |

#### Returns

`RelatedQueryBuilder`\<[`User`](models_User.User.md)[`K`]\>

#### Inherited from

Model.$relatedQuery

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1666

▸ **$relatedQuery**\<`RM`\>(`relationName`, `trxOrKnex?`): `QueryBuilderType`\<`RM`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `RM` | extends `Model` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `relationName` | `string` |
| `trxOrKnex?` | `TransactionOrKnex` |

#### Returns

`QueryBuilderType`\<`RM`\>

#### Inherited from

Model.$relatedQuery

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1671

___

### $set

▸ **$set**(`obj`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `Pojo` |

#### Returns

`this`

#### Inherited from

Model.$set

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1721

___

### $setDatabaseJson

▸ **$setDatabaseJson**(`json`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `object` |

#### Returns

`this`

#### Inherited from

Model.$setDatabaseJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1709

___

### $setJson

▸ **$setJson**(`json`, `opt?`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `object` |
| `opt?` | `ModelOptions` |

#### Returns

`this`

#### Inherited from

Model.$setJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1708

___

### $setRelated

▸ **$setRelated**\<`RM`\>(`relation`, `related`): `this`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `RM` | extends `Model` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `relation` | `String` \| `Relation` |
| `related` | `undefined` \| ``null`` \| `RM` \| `RM`[] |

#### Returns

`this`

#### Inherited from

Model.$setRelated

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1711

___

### $toDatabaseJson

▸ **$toDatabaseJson**(): `Pojo`

#### Returns

`Pojo`

#### Inherited from

Model.$toDatabaseJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1704

___

### $toJson

▸ **$toJson**(`opt?`): `ModelObject`\<[`User`](models_User.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | `ToJsonOptions` |

#### Returns

`ModelObject`\<[`User`](models_User.User.md)\>

#### Inherited from

Model.$toJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1705

___

### $transaction

▸ **$transaction**(): `Knex`\<`any`, `any`[]\>

#### Returns

`Knex`\<`any`, `any`[]\>

#### Inherited from

Model.$transaction

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1731

___

### $traverse

▸ **$traverse**(`filterConstructor`, `traverser`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filterConstructor` | typeof `Model` |
| `traverser` | `TraverserFunction` |

#### Returns

`this`

#### Inherited from

Model.$traverse

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1723

▸ **$traverse**(`traverser`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `traverser` | `TraverserFunction` |

#### Returns

`this`

#### Inherited from

Model.$traverse

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1724

___

### $traverseAsync

▸ **$traverseAsync**(`filterConstructor`, `traverser`): `Promise`\<[`User`](models_User.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filterConstructor` | typeof `Model` |
| `traverser` | `TraverserFunction` |

#### Returns

`Promise`\<[`User`](models_User.User.md)\>

#### Inherited from

Model.$traverseAsync

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1725

▸ **$traverseAsync**(`traverser`): `Promise`\<[`User`](models_User.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `traverser` | `TraverserFunction` |

#### Returns

`Promise`\<[`User`](models_User.User.md)\>

#### Inherited from

Model.$traverseAsync

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1726

___

### $validate

▸ **$validate**(`json?`, `opt?`): `Pojo`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json?` | `Pojo` |
| `opt?` | `ModelOptions` |

#### Returns

`Pojo`

#### Inherited from

Model.$validate

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1693

___

### toJSON

▸ **toJSON**(`opt?`): `ModelObject`\<[`User`](models_User.User.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | `ToJsonOptions` |

#### Returns

`ModelObject`\<[`User`](models_User.User.md)\>

#### Inherited from

Model.toJSON

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1706

___

### afterDelete

▸ **afterDelete**(`args`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `StaticHookArguments`\<`any`, `any`\> |

#### Returns

`any`

#### Inherited from

Model.afterDelete

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1662

___

### afterFind

▸ **afterFind**(`args`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `StaticHookArguments`\<`any`, `any`\> |

#### Returns

`any`

#### Inherited from

Model.afterFind

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1656

___

### afterInsert

▸ **afterInsert**(`args`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `StaticHookArguments`\<`any`, `any`\> |

#### Returns

`any`

#### Inherited from

Model.afterInsert

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1658

___

### afterUpdate

▸ **afterUpdate**(`args`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `StaticHookArguments`\<`any`, `any`\> |

#### Returns

`any`

#### Inherited from

Model.afterUpdate

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1660

___

### beforeDelete

▸ **beforeDelete**(`args`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `StaticHookArguments`\<`any`, `any`\> |

#### Returns

`any`

#### Inherited from

Model.beforeDelete

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1661

___

### beforeFind

▸ **beforeFind**(`args`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `StaticHookArguments`\<`any`, `any`\> |

#### Returns

`any`

#### Inherited from

Model.beforeFind

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1655

___

### beforeInsert

▸ **beforeInsert**(`args`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `StaticHookArguments`\<`any`, `any`\> |

#### Returns

`any`

#### Inherited from

Model.beforeInsert

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1657

___

### beforeUpdate

▸ **beforeUpdate**(`args`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `StaticHookArguments`\<`any`, `any`\> |

#### Returns

`any`

#### Inherited from

Model.beforeUpdate

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1659

___

### bindKnex

▸ **bindKnex**\<`M`\>(`this`, `trxOrKnex`): `M`

#### Type parameters

| Name |
| :------ |
| `M` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `M` |
| `trxOrKnex` | `TransactionOrKnex` |

#### Returns

`M`

#### Inherited from

Model.bindKnex

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1622

___

### bindTransaction

▸ **bindTransaction**\<`M`\>(`this`, `trxOrKnex`): `M`

#### Type parameters

| Name |
| :------ |
| `M` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `M` |
| `trxOrKnex` | `TransactionOrKnex` |

#### Returns

`M`

#### Inherited from

Model.bindTransaction

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1623

___

### columnNameToPropertyName

▸ **columnNameToPropertyName**(`columnName`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `columnName` | `string` |

#### Returns

`string`

#### Inherited from

Model.columnNameToPropertyName

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1602

___

### createNotFoundError

▸ **createNotFoundError**(`queryContext`, `args`): `Error`

#### Parameters

| Name | Type |
| :------ | :------ |
| `queryContext` | `QueryContext` |
| `args` | `CreateNotFoundErrorArgs` |

#### Returns

`Error`

#### Inherited from

Model.createNotFoundError

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1607

___

### createValidationError

▸ **createValidationError**(`args`): `Error`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `CreateValidationErrorArgs` |

#### Returns

`Error`

#### Inherited from

Model.createValidationError

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1606

___

### createValidator

▸ **createValidator**(): `Validator`

#### Returns

`Validator`

#### Inherited from

Model.createValidator

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1605

___

### fetchGraph

▸ **fetchGraph**\<`M`\>(`this`, `modelOrObject`, `expression`, `options?`): `SingleQueryBuilder`\<`QueryBuilderType`\<`M`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `Model` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `Constructor`\<`M`\> |
| `modelOrObject` | `PartialModelObject`\<`M`\> |
| `expression` | `RelationExpression`\<`M`\> |
| `options?` | `FetchGraphOptions` |

#### Returns

`SingleQueryBuilder`\<`QueryBuilderType`\<`M`\>\>

#### Inherited from

Model.fetchGraph

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1625

▸ **fetchGraph**\<`M`\>(`this`, `modelOrObject`, `expression`, `options?`): `QueryBuilderType`\<`M`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `Model` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `Constructor`\<`M`\> |
| `modelOrObject` | `PartialModelObject`\<`M`\>[] |
| `expression` | `RelationExpression`\<`M`\> |
| `options?` | `FetchGraphOptions` |

#### Returns

`QueryBuilderType`\<`M`\>

#### Inherited from

Model.fetchGraph

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1632

___

### fetchTableMetadata

▸ **fetchTableMetadata**(`opt?`): `Promise`\<`TableMetadata`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | `FetchTableMetadataOptions` |

#### Returns

`Promise`\<`TableMetadata`\>

#### Inherited from

Model.fetchTableMetadata

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1610

___

### fromDatabaseJson

▸ **fromDatabaseJson**\<`M`\>(`this`, `json`): `M`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `Model` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `Constructor`\<`M`\> |
| `json` | `object` |

#### Returns

`M`

#### Inherited from

Model.fromDatabaseJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1600

___

### fromJson

▸ **fromJson**\<`M`\>(`this`, `json`, `opt?`): `M`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `Model` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `Constructor`\<`M`\> |
| `json` | `object` |
| `opt?` | `ModelOptions` |

#### Returns

`M`

#### Inherited from

Model.fromJson

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1599

___

### getRelation

▸ **getRelation**(`name`): `Relation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Relation`

#### Inherited from

Model.getRelation

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1640

___

### getRelations

▸ **getRelations**(): `Relations`

#### Returns

`Relations`

#### Inherited from

Model.getRelations

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1639

___

### knex

▸ **knex**(`knex?`): `Knex`\<`any`, `any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `knex?` | `Knex`\<`any`, `any`[]\> |

#### Returns

`Knex`\<`any`, `any`[]\>

#### Inherited from

Model.knex

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1612

___

### knexQuery

▸ **knexQuery**(): `QueryBuilder`\<`any`, `any`\>

#### Returns

`QueryBuilder`\<`any`, `any`\>

#### Inherited from

Model.knexQuery

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1613

___

### propertyNameToColumnName

▸ **propertyNameToColumnName**(`propertyName`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `propertyName` | `string` |

#### Returns

`string`

#### Inherited from

Model.propertyNameToColumnName

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1603

___

### query

▸ **query**\<`M`\>(`this`, `trxOrKnex?`): `QueryBuilderType`\<`M`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `Model` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `Constructor`\<`M`\> |
| `trxOrKnex?` | `TransactionOrKnex` |

#### Returns

`QueryBuilderType`\<`M`\>

#### Inherited from

Model.query

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1583

___

### relatedQuery

▸ **relatedQuery**\<`M`, `K`\>(`this`, `relationName`, `trxOrKnex?`): `ArrayRelatedQueryBuilder`\<`M`[`K`]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `Model` |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `ConstructorType`\<`M`, `PrototypeType`\<`M`\>\> |
| `relationName` | `K` |
| `trxOrKnex?` | `TransactionOrKnex` |

#### Returns

`ArrayRelatedQueryBuilder`\<`M`[`K`]\>

#### Inherited from

Model.relatedQuery

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1588

▸ **relatedQuery**\<`RM`\>(`relationName`, `trxOrKnex?`): `QueryBuilderType`\<`RM`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `RM` | extends `Model` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `relationName` | `string` |
| `trxOrKnex?` | `TransactionOrKnex` |

#### Returns

`QueryBuilderType`\<`RM`\>

#### Inherited from

Model.relatedQuery

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1594

___

### startTransaction

▸ **startTransaction**(`knexOrTransaction?`): `Promise`\<`Transaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `knexOrTransaction?` | `TransactionOrKnex` |

#### Returns

`Promise`\<`Transaction`\>

#### Inherited from

Model.startTransaction

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1614

___

### tableMetadata

▸ **tableMetadata**(`opt?`): `TableMetadata`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | `TableMetadataOptions` |

#### Returns

`TableMetadata`

#### Inherited from

Model.tableMetadata

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1609

___

### transaction

▸ **transaction**\<`T`\>(`callback`): `Promise`\<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`trx`: `Transaction`) => `Promise`\<`T`\> |

#### Returns

`Promise`\<`T`\>

#### Inherited from

Model.transaction

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1616

▸ **transaction**\<`T`\>(`trxOrKnex`, `callback`): `Promise`\<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `trxOrKnex` | `undefined` \| `TransactionOrKnex` |
| `callback` | (`trx`: `Transaction`) => `Promise`\<`T`\> |

#### Returns

`Promise`\<`T`\>

#### Inherited from

Model.transaction

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1617

___

### traverse

▸ **traverse**(`models`, `traverser`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `models` | `Model` \| `Model`[] |
| `traverser` | `TraverserFunction` |

#### Returns

`void`

#### Inherited from

Model.traverse

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1642

▸ **traverse**(`filterConstructor`, `models`, `traverser`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filterConstructor` | typeof `Model` |
| `models` | `Model` \| `Model`[] |
| `traverser` | `TraverserFunction` |

#### Returns

`void`

#### Inherited from

Model.traverse

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1643

___

### traverseAsync

▸ **traverseAsync**(`models`, `traverser`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `models` | `Model` \| `Model`[] |
| `traverser` | `TraverserFunction` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Model.traverseAsync

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1648

▸ **traverseAsync**(`filterConstructor`, `models`, `traverser`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filterConstructor` | typeof `Model` |
| `models` | `Model` \| `Model`[] |
| `traverser` | `TraverserFunction` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

Model.traverseAsync

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1649
