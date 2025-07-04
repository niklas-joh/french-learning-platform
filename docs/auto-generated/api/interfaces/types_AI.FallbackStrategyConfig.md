[server](../README.md) / [Exports](../modules.md) / [types/AI](../modules/types_AI.md) / FallbackStrategyConfig

# Interface: FallbackStrategyConfig

[types/AI](../modules/types_AI.md).FallbackStrategyConfig

**`Description`**

Configuration for AI fallback strategy with specific type constraints.

## Table of contents

### Properties

- [enabled](types_AI.FallbackStrategyConfig.md#enabled)
- [staticContent](types_AI.FallbackStrategyConfig.md#staticcontent)

## Properties

### enabled

• **enabled**: `boolean`

Whether fallback is enabled

#### Defined in

[server/src/types/AI.ts:84](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L84)

___

### staticContent

• **staticContent**: `Object`

Type-safe static content fallbacks for each AI task type

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ASSESS_PRONUNCIATION` | `undefined` \| `Partial`\<\{ `feedback`: `string` ; `improvements?`: `string`[] ; `score`: `number`  }\> |
| `CONVERSATIONAL_TUTOR_RESPONSE` | `undefined` \| `Partial`\<\{ `response`: `string` ; `suggestions?`: `string`[]  }\> |
| `GENERATE_CURRICULUM_PATH` | `undefined` \| `Partial`\<\{ `path`: `any`[]  }\> |
| `GENERATE_LESSON` | `undefined` \| `Partial`\<[`Lesson`](models_Lesson.Lesson.md)\> |
| `GRADE_RESPONSE` | `undefined` \| `Partial`\<\{ `feedback`: `string` ; `isCorrect`: `boolean` ; `score`: `number` ; `suggestions?`: `string`[]  }\> |

#### Defined in

[server/src/types/AI.ts:86](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/AI.ts#L86)
