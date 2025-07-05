[server](../README.md) / [Exports](../modules.md) / [services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md) / IContentValidatorFactory

# Interface: IContentValidatorFactory

[services/contentGeneration/interfaces](../modules/services_contentGeneration_interfaces.md).IContentValidatorFactory

Factory interface for content validators
Enables different validation strategies per content type
TODO: Reference Future Implementation #23 - Centralized Dependency Injection (DI) Container

## Implemented by

- [`ContentValidatorFactory`](../classes/services_contentGeneration_ContentValidatorFactory.ContentValidatorFactory.md)

## Table of contents

### Methods

- [getValidator](services_contentGeneration_interfaces.IContentValidatorFactory.md#getvalidator)

## Methods

### getValidator

▸ **getValidator**(`type`): [`IContentValidator`](services_contentGeneration_interfaces.IContentValidator.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`ContentType`](../modules/types_Content.md#contenttype) |

#### Returns

[`IContentValidator`](services_contentGeneration_interfaces.IContentValidator.md)

#### Defined in

[server/src/services/contentGeneration/interfaces.ts:69](https://github.com/niklas-joh/french-learning-platform/blob/f88c80a984d39a715bd427891d156cc94cff3831/server/src/services/contentGeneration/interfaces.ts#L69)
