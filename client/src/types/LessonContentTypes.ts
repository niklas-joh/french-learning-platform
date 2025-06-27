export interface VocabularyItem {
  word: string;
  translation: string;
  example_sentence: string;
}

export interface VocabularyContent {
  items: VocabularyItem[];
}

export interface GrammarContent {
  rule: string;
  explanation: string;
  examples: string[];
}

export interface ConversationLine {
  speaker: string;
  line: string;
}

export interface ConversationContent {
  title: string;
  dialogue: ConversationLine[];
}
