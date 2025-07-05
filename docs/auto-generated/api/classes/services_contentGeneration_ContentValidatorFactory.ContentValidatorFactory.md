[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/ContentValidatorFactory](../modules/services_contentGeneration_ContentValidatorFactory.md) / ContentValidatorFactory

# Class: ContentValidatorFactory

[services/contentGeneration/ContentValidatorFactory](../modules/services_contentGeneration_ContentValidatorFactory.md).ContentValidatorFactory

Factory interface for content validators
Enables different validation strategies per content type
TODO: Reference Future Implementation #23 - Centralized Dependency Injection (DI) Container

## Implements

- [`IContentValidatorFactory`](../interfaces/services_contentGeneration_interfaces.IContentValidatorFactory.md)

## Table of contents

### Constructors

- [constructor](services_contentGeneration_ContentValidatorFactory.ContentValidatorFactory.md#constructor)

### Properties

- [logger](services_contentGeneration_ContentValidatorFactory.ContentValidatorFactory.md#logger)
- [validators](services_contentGeneration_ContentValidatorFactory.ContentValidatorFactory.md#validators)

### Methods

- [getValidator](services_contentGeneration_ContentValidatorFactory.ContentValidatorFactory.md#getvalidator)

## Constructors

### constructor

• **new ContentValidatorFactory**(`logger`): [`ContentValidatorFactory`](services_contentGeneration_ContentValidatorFactory.ContentValidatorFactory.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`ILogger`](../interfaces/types_ILogger.ILogger.md) |

#### Returns

[`ContentValidatorFactory`](services_contentGeneration_ContentValidatorFactory.ContentValidatorFactory.md)

#### Defined in

[server/src/services/contentGeneration/ContentValidatorFactory.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/ContentValidatorFactory.ts#L11)

## Properties

### logger

• `Private` **logger**: [`ILogger`](../interfaces/types_ILogger.ILogger.md)

#### Defined in

[server/src/services/contentGeneration/ContentValidatorFactory.ts:11](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/ContentValidatorFactory.ts#L11)

___

### validators

• `Private` **validators**: `Map`\<[`ContentType`](../modules/types_Content.md#contenttype), [`IContentValidator`](../interfaces/services_contentGeneration_interfaces.IContentValidator.md)\>

#### Defined in

[server/src/services/contentGeneration/ContentValidatorFactory.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/ContentValidatorFactory.ts#L9)

## Methods

### getValidator

▸ **getValidator**(`type`): [`IContentValidator`](../interfaces/services_contentGeneration_interfaces.IContentValidator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`ContentType`](../modules/types_Content.md#contenttype) |

#### Returns

[`IContentValidator`](../interfaces/services_contentGeneration_interfaces.IContentValidator.md)

#### Implementation of

[IContentValidatorFactory](../interfaces/services_contentGeneration_interfaces.IContentValidatorFactory.md).[getValidator](../interfaces/services_contentGeneration_interfaces.IContentValidatorFactory.md#getvalidator)

#### Defined in

[server/src/services/contentGeneration/ContentValidatorFactory.ts:21](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/ContentValidatorFactory.ts#L21)
