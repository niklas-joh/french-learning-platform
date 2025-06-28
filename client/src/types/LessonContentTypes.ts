// For vocabulary lessons
export interface VocabularyItem {
  word: string;
  translation: string;
  example_sentence: string;
}
export interface VocabularyContent {
  items: VocabularyItem[];
}

// For grammar lessons
export interface GrammarContent {
  rule: string;
  explanation: string;
  examples: string[];
}

// For conversation lessons
export interface ConversationLine {
  speaker: string;
  line: string;
}
export interface ConversationContent {
  title: string;
  dialogue: ConversationLine[];
}
