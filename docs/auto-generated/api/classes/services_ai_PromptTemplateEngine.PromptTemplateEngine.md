[server](../README.md) / [Exports](../modules.md) / [services/ai/PromptTemplateEngine](../modules/services_ai_PromptTemplateEngine.md) / PromptTemplateEngine

# Class: PromptTemplateEngine

[services/ai/PromptTemplateEngine](../modules/services_ai_PromptTemplateEngine.md).PromptTemplateEngine

PromptTemplateEngine

**`Description`**

Placeholder for a service that will manage and render complex prompt templates.

**`Todo`**

[Task 3.1.B] Implement a simple template engine for dynamic content generation.

## Table of contents

### Constructors

- [constructor](services_ai_PromptTemplateEngine.PromptTemplateEngine.md#constructor)

### Methods

- [generateContentPrompt](services_ai_PromptTemplateEngine.PromptTemplateEngine.md#generatecontentprompt)

## Constructors

### constructor

• **new PromptTemplateEngine**(): [`PromptTemplateEngine`](services_ai_PromptTemplateEngine.PromptTemplateEngine.md)

#### Returns

[`PromptTemplateEngine`](services_ai_PromptTemplateEngine.PromptTemplateEngine.md)

#### Defined in

[server/src/services/ai/PromptTemplateEngine.ts:9](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/PromptTemplateEngine.ts#L9)

## Methods

### generateContentPrompt

▸ **generateContentPrompt**(`params`): `Promise`\<`string`\>

Generate content prompt for AI generation
TODO: Implement proper template engine logic in future tasks

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.context` | `any` |
| `params.request` | `any` |
| `params.template` | `any` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[server/src/services/ai/PromptTemplateEngine.ts:15](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/services/ai/PromptTemplateEngine.ts#L15)
