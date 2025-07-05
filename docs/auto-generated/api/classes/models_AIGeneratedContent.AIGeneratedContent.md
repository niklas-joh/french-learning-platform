[server](../README.md) / [Exports](../modules.md) / [models/AIGeneratedContent](../modules/models_AIGeneratedContent.md) / AIGeneratedContent

# Class: AIGeneratedContent

[models/AIGeneratedContent](../modules/models_AIGeneratedContent.md).AIGeneratedContent

## Hierarchy

- `Model`

  ↳ **`AIGeneratedContent`**

## Implements

- [`AIGeneratedContentData`](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md)

## Table of contents

### Constructors

- [constructor](models_AIGeneratedContent.AIGeneratedContent.md#constructor)

### Properties

- [$modelClass](models_AIGeneratedContent.AIGeneratedContent.md#$modelclass)
- [QueryBuilderType](models_AIGeneratedContent.AIGeneratedContent.md#querybuildertype)
- [createdAt](models_AIGeneratedContent.AIGeneratedContent.md#createdat)
- [estimatedCompletionTime](models_AIGeneratedContent.AIGeneratedContent.md#estimatedcompletiontime)
- [expiresAt](models_AIGeneratedContent.AIGeneratedContent.md#expiresat)
- [focusAreas](models_AIGeneratedContent.AIGeneratedContent.md#focusareas)
- [generatedData](models_AIGeneratedContent.AIGeneratedContent.md#generateddata)
- [generationTimeMs](models_AIGeneratedContent.AIGeneratedContent.md#generationtimems)
- [id](models_AIGeneratedContent.AIGeneratedContent.md#id)
- [lastAccessedAt](models_AIGeneratedContent.AIGeneratedContent.md#lastaccessedat)
- [level](models_AIGeneratedContent.AIGeneratedContent.md#level)
- [metadata](models_AIGeneratedContent.AIGeneratedContent.md#metadata)
- [modelUsed](models_AIGeneratedContent.AIGeneratedContent.md#modelused)
- [requestPayload](models_AIGeneratedContent.AIGeneratedContent.md#requestpayload)
- [status](models_AIGeneratedContent.AIGeneratedContent.md#status)
- [tokenUsage](models_AIGeneratedContent.AIGeneratedContent.md#tokenusage)
- [topics](models_AIGeneratedContent.AIGeneratedContent.md#topics)
- [type](models_AIGeneratedContent.AIGeneratedContent.md#type)
- [updatedAt](models_AIGeneratedContent.AIGeneratedContent.md#updatedat)
- [usageCount](models_AIGeneratedContent.AIGeneratedContent.md#usagecount)
- [userId](models_AIGeneratedContent.AIGeneratedContent.md#userid)
- [validationResults](models_AIGeneratedContent.AIGeneratedContent.md#validationresults)
- [validationScore](models_AIGeneratedContent.AIGeneratedContent.md#validationscore)
- [BelongsToOneRelation](models_AIGeneratedContent.AIGeneratedContent.md#belongstoonerelation)
- [HasManyRelation](models_AIGeneratedContent.AIGeneratedContent.md#hasmanyrelation)
- [HasOneRelation](models_AIGeneratedContent.AIGeneratedContent.md#hasonerelation)
- [HasOneThroughRelation](models_AIGeneratedContent.AIGeneratedContent.md#hasonethroughrelation)
- [ManyToManyRelation](models_AIGeneratedContent.AIGeneratedContent.md#manytomanyrelation)
- [QueryBuilder](models_AIGeneratedContent.AIGeneratedContent.md#querybuilder)
- [columnNameMappers](models_AIGeneratedContent.AIGeneratedContent.md#columnnamemappers)
- [dbRefProp](models_AIGeneratedContent.AIGeneratedContent.md#dbrefprop)
- [defaultGraphOptions](models_AIGeneratedContent.AIGeneratedContent.md#defaultgraphoptions)
- [fn](models_AIGeneratedContent.AIGeneratedContent.md#fn)
- [idColumn](models_AIGeneratedContent.AIGeneratedContent.md#idcolumn)
- [jsonAttributes](models_AIGeneratedContent.AIGeneratedContent.md#jsonattributes)
- [jsonSchema](models_AIGeneratedContent.AIGeneratedContent.md#jsonschema)
- [modelPaths](models_AIGeneratedContent.AIGeneratedContent.md#modelpaths)
- [modifiers](models_AIGeneratedContent.AIGeneratedContent.md#modifiers)
- [pickJsonSchemaProperties](models_AIGeneratedContent.AIGeneratedContent.md#pickjsonschemaproperties)
- [propRefRegex](models_AIGeneratedContent.AIGeneratedContent.md#proprefregex)
- [raw](models_AIGeneratedContent.AIGeneratedContent.md#raw)
- [ref](models_AIGeneratedContent.AIGeneratedContent.md#ref)
- [relatedFindQueryMutates](models_AIGeneratedContent.AIGeneratedContent.md#relatedfindquerymutates)
- [relatedInsertQueryMutates](models_AIGeneratedContent.AIGeneratedContent.md#relatedinsertquerymutates)
- [relationMappings](models_AIGeneratedContent.AIGeneratedContent.md#relationmappings)
- [tableName](models_AIGeneratedContent.AIGeneratedContent.md#tablename)
- [uidProp](models_AIGeneratedContent.AIGeneratedContent.md#uidprop)
- [uidRefProp](models_AIGeneratedContent.AIGeneratedContent.md#uidrefprop)
- [useLimitInFirst](models_AIGeneratedContent.AIGeneratedContent.md#uselimitinfirst)
- [virtualAttributes](models_AIGeneratedContent.AIGeneratedContent.md#virtualattributes)

### Methods

- [$afterDelete](models_AIGeneratedContent.AIGeneratedContent.md#$afterdelete)
- [$afterFind](models_AIGeneratedContent.AIGeneratedContent.md#$afterfind)
- [$afterInsert](models_AIGeneratedContent.AIGeneratedContent.md#$afterinsert)
- [$afterUpdate](models_AIGeneratedContent.AIGeneratedContent.md#$afterupdate)
- [$afterValidate](models_AIGeneratedContent.AIGeneratedContent.md#$aftervalidate)
- [$appendRelated](models_AIGeneratedContent.AIGeneratedContent.md#$appendrelated)
- [$beforeDelete](models_AIGeneratedContent.AIGeneratedContent.md#$beforedelete)
- [$beforeInsert](models_AIGeneratedContent.AIGeneratedContent.md#$beforeinsert)
- [$beforeUpdate](models_AIGeneratedContent.AIGeneratedContent.md#$beforeupdate)
- [$beforeValidate](models_AIGeneratedContent.AIGeneratedContent.md#$beforevalidate)
- [$clone](models_AIGeneratedContent.AIGeneratedContent.md#$clone)
- [$fetchGraph](models_AIGeneratedContent.AIGeneratedContent.md#$fetchgraph)
- [$formatDatabaseJson](models_AIGeneratedContent.AIGeneratedContent.md#$formatdatabasejson)
- [$formatJson](models_AIGeneratedContent.AIGeneratedContent.md#$formatjson)
- [$id](models_AIGeneratedContent.AIGeneratedContent.md#$id)
- [$knex](models_AIGeneratedContent.AIGeneratedContent.md#$knex)
- [$omitFromDatabaseJson](models_AIGeneratedContent.AIGeneratedContent.md#$omitfromdatabasejson)
- [$omitFromJson](models_AIGeneratedContent.AIGeneratedContent.md#$omitfromjson)
- [$parseDatabaseJson](models_AIGeneratedContent.AIGeneratedContent.md#$parsedatabasejson)
- [$parseJson](models_AIGeneratedContent.AIGeneratedContent.md#$parsejson)
- [$query](models_AIGeneratedContent.AIGeneratedContent.md#$query)
- [$relatedQuery](models_AIGeneratedContent.AIGeneratedContent.md#$relatedquery)
- [$set](models_AIGeneratedContent.AIGeneratedContent.md#$set)
- [$setDatabaseJson](models_AIGeneratedContent.AIGeneratedContent.md#$setdatabasejson)
- [$setJson](models_AIGeneratedContent.AIGeneratedContent.md#$setjson)
- [$setRelated](models_AIGeneratedContent.AIGeneratedContent.md#$setrelated)
- [$toDatabaseJson](models_AIGeneratedContent.AIGeneratedContent.md#$todatabasejson)
- [$toJson](models_AIGeneratedContent.AIGeneratedContent.md#$tojson)
- [$transaction](models_AIGeneratedContent.AIGeneratedContent.md#$transaction)
- [$traverse](models_AIGeneratedContent.AIGeneratedContent.md#$traverse)
- [$traverseAsync](models_AIGeneratedContent.AIGeneratedContent.md#$traverseasync)
- [$validate](models_AIGeneratedContent.AIGeneratedContent.md#$validate)
- [isExpired](models_AIGeneratedContent.AIGeneratedContent.md#isexpired)
- [isReusable](models_AIGeneratedContent.AIGeneratedContent.md#isreusable)
- [markAccessed](models_AIGeneratedContent.AIGeneratedContent.md#markaccessed)
- [toJSON](models_AIGeneratedContent.AIGeneratedContent.md#tojson)
- [afterDelete](models_AIGeneratedContent.AIGeneratedContent.md#afterdelete)
- [afterFind](models_AIGeneratedContent.AIGeneratedContent.md#afterfind)
- [afterInsert](models_AIGeneratedContent.AIGeneratedContent.md#afterinsert)
- [afterUpdate](models_AIGeneratedContent.AIGeneratedContent.md#afterupdate)
- [beforeDelete](models_AIGeneratedContent.AIGeneratedContent.md#beforedelete)
- [beforeFind](models_AIGeneratedContent.AIGeneratedContent.md#beforefind)
- [beforeInsert](models_AIGeneratedContent.AIGeneratedContent.md#beforeinsert)
- [beforeUpdate](models_AIGeneratedContent.AIGeneratedContent.md#beforeupdate)
- [bindKnex](models_AIGeneratedContent.AIGeneratedContent.md#bindknex)
- [bindTransaction](models_AIGeneratedContent.AIGeneratedContent.md#bindtransaction)
- [cleanup](models_AIGeneratedContent.AIGeneratedContent.md#cleanup)
- [columnNameToPropertyName](models_AIGeneratedContent.AIGeneratedContent.md#columnnametopropertyname)
- [createNotFoundError](models_AIGeneratedContent.AIGeneratedContent.md#createnotfounderror)
- [createValidationError](models_AIGeneratedContent.AIGeneratedContent.md#createvalidationerror)
- [createValidator](models_AIGeneratedContent.AIGeneratedContent.md#createvalidator)
- [fetchGraph](models_AIGeneratedContent.AIGeneratedContent.md#fetchgraph)
- [fetchTableMetadata](models_AIGeneratedContent.AIGeneratedContent.md#fetchtablemetadata)
- [findByUserAndType](models_AIGeneratedContent.AIGeneratedContent.md#findbyuserandtype)
- [findReusableContent](models_AIGeneratedContent.AIGeneratedContent.md#findreusablecontent)
- [fromDatabaseJson](models_AIGeneratedContent.AIGeneratedContent.md#fromdatabasejson)
- [fromJson](models_AIGeneratedContent.AIGeneratedContent.md#fromjson)
- [getRelation](models_AIGeneratedContent.AIGeneratedContent.md#getrelation)
- [getRelations](models_AIGeneratedContent.AIGeneratedContent.md#getrelations)
- [knex](models_AIGeneratedContent.AIGeneratedContent.md#knex)
- [knexQuery](models_AIGeneratedContent.AIGeneratedContent.md#knexquery)
- [propertyNameToColumnName](models_AIGeneratedContent.AIGeneratedContent.md#propertynametocolumnname)
- [query](models_AIGeneratedContent.AIGeneratedContent.md#query)
- [relatedQuery](models_AIGeneratedContent.AIGeneratedContent.md#relatedquery)
- [startTransaction](models_AIGeneratedContent.AIGeneratedContent.md#starttransaction)
- [tableMetadata](models_AIGeneratedContent.AIGeneratedContent.md#tablemetadata)
- [transaction](models_AIGeneratedContent.AIGeneratedContent.md#transaction)
- [traverse](models_AIGeneratedContent.AIGeneratedContent.md#traverse)
- [traverseAsync](models_AIGeneratedContent.AIGeneratedContent.md#traverseasync)

## Constructors

### constructor

• **new AIGeneratedContent**(): [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)

#### Returns

[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)

#### Inherited from

Model.constructor

## Properties

### $modelClass

• **$modelClass**: `ModelClass`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

#### Inherited from

Model.$modelClass

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1664

___

### QueryBuilderType

• **QueryBuilderType**: `QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)[]\>

#### Inherited from

Model.QueryBuilderType

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1733

___

### createdAt

• **createdAt**: `Date`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[createdAt](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#createdat)

#### Defined in

[server/src/models/AIGeneratedContent.ts:53](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L53)

___

### estimatedCompletionTime

• `Optional` **estimatedCompletionTime**: `number`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[estimatedCompletionTime](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#estimatedcompletiontime)

#### Defined in

[server/src/models/AIGeneratedContent.ts:45](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L45)

___

### expiresAt

• `Optional` **expiresAt**: `Date`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[expiresAt](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#expiresat)

#### Defined in

[server/src/models/AIGeneratedContent.ts:52](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L52)

___

### focusAreas

• `Optional` **focusAreas**: `string`[]

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[focusAreas](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#focusareas)

#### Defined in

[server/src/models/AIGeneratedContent.ts:44](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L44)

___

### generatedData

• `Optional` **generatedData**: `any`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[generatedData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#generateddata)

#### Defined in

[server/src/models/AIGeneratedContent.ts:39](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L39)

___

### generationTimeMs

• `Optional` **generationTimeMs**: `number`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[generationTimeMs](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#generationtimems)

#### Defined in

[server/src/models/AIGeneratedContent.ts:47](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L47)

___

### id

• **id**: `string`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[id](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#id)

#### Defined in

[server/src/models/AIGeneratedContent.ts:34](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L34)

___

### lastAccessedAt

• `Optional` **lastAccessedAt**: `Date`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[lastAccessedAt](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#lastaccessedat)

#### Defined in

[server/src/models/AIGeneratedContent.ts:51](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L51)

___

### level

• `Optional` **level**: `string`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[level](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#level)

#### Defined in

[server/src/models/AIGeneratedContent.ts:42](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L42)

___

### metadata

• `Optional` **metadata**: `any`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[metadata](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#metadata)

#### Defined in

[server/src/models/AIGeneratedContent.ts:41](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L41)

___

### modelUsed

• `Optional` **modelUsed**: `string`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[modelUsed](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#modelused)

#### Defined in

[server/src/models/AIGeneratedContent.ts:49](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L49)

___

### requestPayload

• **requestPayload**: `any`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[requestPayload](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#requestpayload)

#### Defined in

[server/src/models/AIGeneratedContent.ts:38](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L38)

___

### status

• **status**: ``"pending"`` \| ``"completed"`` \| ``"failed"`` \| ``"generating"`` \| ``"cached"``

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[status](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#status)

#### Defined in

[server/src/models/AIGeneratedContent.ts:37](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L37)

___

### tokenUsage

• `Optional` **tokenUsage**: `number`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[tokenUsage](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#tokenusage)

#### Defined in

[server/src/models/AIGeneratedContent.ts:48](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L48)

___

### topics

• `Optional` **topics**: `string`[]

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[topics](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#topics)

#### Defined in

[server/src/models/AIGeneratedContent.ts:43](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L43)

___

### type

• **type**: ``"lesson"`` \| ``"vocabulary_drill"`` \| ``"grammar_exercise"`` \| ``"cultural_content"`` \| ``"personalized_exercise"`` \| ``"pronunciation_drill"`` \| ``"conversation_practice"``

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[type](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#type)

#### Defined in

[server/src/models/AIGeneratedContent.ts:36](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L36)

___

### updatedAt

• **updatedAt**: `Date`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[updatedAt](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#updatedat)

#### Defined in

[server/src/models/AIGeneratedContent.ts:54](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L54)

___

### usageCount

• **usageCount**: `number`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[usageCount](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#usagecount)

#### Defined in

[server/src/models/AIGeneratedContent.ts:50](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L50)

___

### userId

• **userId**: `number`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[userId](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#userid)

#### Defined in

[server/src/models/AIGeneratedContent.ts:35](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L35)

___

### validationResults

• `Optional` **validationResults**: `any`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[validationResults](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#validationresults)

#### Defined in

[server/src/models/AIGeneratedContent.ts:40](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L40)

___

### validationScore

• `Optional` **validationScore**: `number`

#### Implementation of

[AIGeneratedContentData](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md).[validationScore](../interfaces/models_AIGeneratedContent.AIGeneratedContentData.md#validationscore)

#### Defined in

[server/src/models/AIGeneratedContent.ts:46](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L46)

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

▪ `Static` **jsonSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `properties` | \{ `estimatedCompletionTime`: \{ `minimum`: `number` = 0; `type`: `string`[]  } ; `expiresAt`: \{ `format`: `string` = 'date-time'; `type`: `string`[]  } ; `focusAreas`: \{ `type`: `string`[]  } ; `generatedData`: \{ `type`: `string`[]  } ; `generationTimeMs`: \{ `minimum`: `number` = 0; `type`: `string`[]  } ; `id`: \{ `format`: `string` = 'uuid'; `type`: `string` = 'string' } ; `lastAccessedAt`: \{ `format`: `string` = 'date-time'; `type`: `string`[]  } ; `level`: \{ `maxLength`: `number` = 10; `type`: `string`[]  } ; `metadata`: \{ `type`: `string`[]  } ; `modelUsed`: \{ `maxLength`: `number` = 50; `type`: `string`[]  } ; `requestPayload`: \{ `type`: `string` = 'object' } ; `status`: \{ `enum`: `string`[] ; `type`: `string` = 'string' } ; `tokenUsage`: \{ `minimum`: `number` = 0; `type`: `string`[]  } ; `topics`: \{ `type`: `string`[]  } ; `type`: \{ `enum`: `string`[] ; `type`: `string` = 'string' } ; `usageCount`: \{ `default`: `number` = 0; `minimum`: `number` = 0; `type`: `string` = 'integer' } ; `userId`: \{ `type`: `string` = 'integer' } ; `validationResults`: \{ `type`: `string`[]  } ; `validationScore`: \{ `maximum`: `number` = 1; `minimum`: `number` = 0; `type`: `string`[]  }  } |
| `properties.estimatedCompletionTime` | \{ `minimum`: `number` = 0; `type`: `string`[]  } |
| `properties.estimatedCompletionTime.minimum` | `number` |
| `properties.estimatedCompletionTime.type` | `string`[] |
| `properties.expiresAt` | \{ `format`: `string` = 'date-time'; `type`: `string`[]  } |
| `properties.expiresAt.format` | `string` |
| `properties.expiresAt.type` | `string`[] |
| `properties.focusAreas` | \{ `type`: `string`[]  } |
| `properties.focusAreas.type` | `string`[] |
| `properties.generatedData` | \{ `type`: `string`[]  } |
| `properties.generatedData.type` | `string`[] |
| `properties.generationTimeMs` | \{ `minimum`: `number` = 0; `type`: `string`[]  } |
| `properties.generationTimeMs.minimum` | `number` |
| `properties.generationTimeMs.type` | `string`[] |
| `properties.id` | \{ `format`: `string` = 'uuid'; `type`: `string` = 'string' } |
| `properties.id.format` | `string` |
| `properties.id.type` | `string` |
| `properties.lastAccessedAt` | \{ `format`: `string` = 'date-time'; `type`: `string`[]  } |
| `properties.lastAccessedAt.format` | `string` |
| `properties.lastAccessedAt.type` | `string`[] |
| `properties.level` | \{ `maxLength`: `number` = 10; `type`: `string`[]  } |
| `properties.level.maxLength` | `number` |
| `properties.level.type` | `string`[] |
| `properties.metadata` | \{ `type`: `string`[]  } |
| `properties.metadata.type` | `string`[] |
| `properties.modelUsed` | \{ `maxLength`: `number` = 50; `type`: `string`[]  } |
| `properties.modelUsed.maxLength` | `number` |
| `properties.modelUsed.type` | `string`[] |
| `properties.requestPayload` | \{ `type`: `string` = 'object' } |
| `properties.requestPayload.type` | `string` |
| `properties.status` | \{ `enum`: `string`[] ; `type`: `string` = 'string' } |
| `properties.status.enum` | `string`[] |
| `properties.status.type` | `string` |
| `properties.tokenUsage` | \{ `minimum`: `number` = 0; `type`: `string`[]  } |
| `properties.tokenUsage.minimum` | `number` |
| `properties.tokenUsage.type` | `string`[] |
| `properties.topics` | \{ `type`: `string`[]  } |
| `properties.topics.type` | `string`[] |
| `properties.type` | \{ `enum`: `string`[] ; `type`: `string` = 'string' } |
| `properties.type.enum` | `string`[] |
| `properties.type.type` | `string` |
| `properties.usageCount` | \{ `default`: `number` = 0; `minimum`: `number` = 0; `type`: `string` = 'integer' } |
| `properties.usageCount.default` | `number` |
| `properties.usageCount.minimum` | `number` |
| `properties.usageCount.type` | `string` |
| `properties.userId` | \{ `type`: `string` = 'integer' } |
| `properties.userId.type` | `string` |
| `properties.validationResults` | \{ `type`: `string`[]  } |
| `properties.validationResults.type` | `string`[] |
| `properties.validationScore` | \{ `maximum`: `number` = 1; `minimum`: `number` = 0; `type`: `string`[]  } |
| `properties.validationScore.maximum` | `number` |
| `properties.validationScore.minimum` | `number` |
| `properties.validationScore.type` | `string`[] |
| `required` | `string`[] |
| `type` | `string` |

#### Overrides

Model.jsonSchema

#### Defined in

[server/src/models/AIGeneratedContent.ts:69](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L69)

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

▪ `Static` **relationMappings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `user` | \{ `join`: \{ `from`: `string` = 'ai\_generated\_content.userId'; `to`: `string` = 'users.id' } ; `modelClass`: typeof [`User`](models_User.User.md) = User; `relation`: `RelationType` = Model.BelongsToOneRelation } |
| `user.join` | \{ `from`: `string` = 'ai\_generated\_content.userId'; `to`: `string` = 'users.id' } |
| `user.join.from` | `string` |
| `user.join.to` | `string` |
| `user.modelClass` | typeof [`User`](models_User.User.md) |
| `user.relation` | `RelationType` |

#### Overrides

Model.relationMappings

#### Defined in

[server/src/models/AIGeneratedContent.ts:57](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L57)

___

### tableName

▪ `Static` **tableName**: `string` = `'ai_generated_content'`

#### Overrides

Model.tableName

#### Defined in

[server/src/models/AIGeneratedContent.ts:31](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L31)

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

▸ **$beforeInsert**(): `void`

#### Returns

`void`

#### Overrides

Model.$beforeInsert

#### Defined in

[server/src/models/AIGeneratedContent.ts:104](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L104)

___

### $beforeUpdate

▸ **$beforeUpdate**(): `void`

#### Returns

`void`

#### Overrides

Model.$beforeUpdate

#### Defined in

[server/src/models/AIGeneratedContent.ts:112](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L112)

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

▸ **$fetchGraph**(`expression`, `options?`): `QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `expression` | `RelationExpression`\<`M`\> |
| `options?` | `FetchGraphOptions` |

#### Returns

`QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

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

▸ **$query**(`trxOrKnex?`): `QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `trxOrKnex?` | `TransactionOrKnex` |

#### Returns

`QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

#### Inherited from

Model.$query

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1676

___

### $relatedQuery

▸ **$relatedQuery**\<`K`\>(`relationName`, `trxOrKnex?`): `RelatedQueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)[`K`]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `relationName` | `K` |
| `trxOrKnex?` | `TransactionOrKnex` |

#### Returns

`RelatedQueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)[`K`]\>

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

▸ **$toJson**(`opt?`): `ModelObject`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | `ToJsonOptions` |

#### Returns

`ModelObject`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

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

▸ **$traverseAsync**(`filterConstructor`, `traverser`): `Promise`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filterConstructor` | typeof `Model` |
| `traverser` | `TraverserFunction` |

#### Returns

`Promise`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

#### Inherited from

Model.$traverseAsync

#### Defined in

node_modules/objection/typings/objection/index.d.ts:1725

▸ **$traverseAsync**(`traverser`): `Promise`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `traverser` | `TraverserFunction` |

#### Returns

`Promise`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

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

### isExpired

▸ **isExpired**(): `boolean`

#### Returns

`boolean`

#### Defined in

[server/src/models/AIGeneratedContent.ts:117](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L117)

___

### isReusable

▸ **isReusable**(): `boolean`

#### Returns

`boolean`

#### Defined in

[server/src/models/AIGeneratedContent.ts:126](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L126)

___

### markAccessed

▸ **markAccessed**(): `void`

#### Returns

`void`

#### Defined in

[server/src/models/AIGeneratedContent.ts:121](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L121)

___

### toJSON

▸ **toJSON**(`opt?`): `ModelObject`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | `ToJsonOptions` |

#### Returns

`ModelObject`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)\>

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

### cleanup

▸ **cleanup**(): `QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), `number`\>

#### Returns

`QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), `number`\>

#### Defined in

[server/src/models/AIGeneratedContent.ts:154](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L154)

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

### findByUserAndType

▸ **findByUserAndType**(`userId`, `type`): `QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |
| `type` | `string` |

#### Returns

`QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)[]\>

#### Defined in

[server/src/models/AIGeneratedContent.ts:131](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L131)

___

### findReusableContent

▸ **findReusableContent**(`userId`, `type`, `level?`): `QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `number` |
| `type` | `string` |
| `level?` | `string` |

#### Returns

`QueryBuilder`\<[`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md), [`AIGeneratedContent`](models_AIGeneratedContent.AIGeneratedContent.md)[]\>

#### Defined in

[server/src/models/AIGeneratedContent.ts:138](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/models/AIGeneratedContent.ts#L138)

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
