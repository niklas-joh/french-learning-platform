[server](../README.md) / [Exports](../modules.md) / types/ai-schemas

# Module: types/ai-schemas

## Table of contents

### Variables

- [AIVocabularyItemSchema](types_ai_schemas.md#aivocabularyitemschema)
- [AIVocabularyListSchema](types_ai_schemas.md#aivocabularylistschema)

## Variables

### AIVocabularyItemSchema

• `Const` **AIVocabularyItemSchema**: `ZodObject`\<\{ `example`: `ZodObject`\<\{ `english`: `ZodString` ; `french`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `english`: `string` ; `french`: `string`  }, \{ `english`: `string` ; `french`: `string`  }\> ; `translation`: `ZodString` ; `word`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `example`: \{ `english`: `string` ; `french`: `string`  } ; `translation`: `string` ; `word`: `string`  }, \{ `example`: \{ `english`: `string` ; `french`: `string`  } ; `translation`: `string` ; `word`: `string`  }\>

Defines the expected structure of a single vocabulary item from the AI.
This schema is used to validate the raw AI output before transforming it
into our internal `VocabularyItem` domain model.

#### Defined in

[server/src/types/ai-schemas.ts:8](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/ai-schemas.ts#L8)

___

### AIVocabularyListSchema

• `Const` **AIVocabularyListSchema**: `ZodArray`\<`ZodObject`\<\{ `example`: `ZodObject`\<\{ `english`: `ZodString` ; `french`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `english`: `string` ; `french`: `string`  }, \{ `english`: `string` ; `french`: `string`  }\> ; `translation`: `ZodString` ; `word`: `ZodString`  }, ``"strip"``, `ZodTypeAny`, \{ `example`: \{ `english`: `string` ; `french`: `string`  } ; `translation`: `string` ; `word`: `string`  }, \{ `example`: \{ `english`: `string` ; `french`: `string`  } ; `translation`: `string` ; `word`: `string`  }\>, ``"many"``\>

Defines the expected structure for a list of vocabulary items.

#### Defined in

[server/src/types/ai-schemas.ts:20](https://github.com/niklas-joh/french-learning-platform/blob/df287cd90d2fc20ebbe1da4bb7d2c97b195a5de7/server/src/types/ai-schemas.ts#L20)
