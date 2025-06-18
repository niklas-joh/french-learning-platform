const fs = require('fs').promises;
const path = require('path');
// Assuming db is exported as module.exports = knexInstance or similar in CJS
// If db is an ES module with export default, .default is needed.
// Let's check server/src/config/db.ts. If it's `export default db;`, then .default is correct.
const db = require('../server/src/config/db').default; 

// For models, if they are .ts files with ES6 exports, ts-node might handle interop.
// If not, and they are compiled to CJS, direct require should work.
const { createTopic, getTopicByName } = require('../server/src/models/Topic');
const { createContent } = require('../server/src/models/Content');
// We need types TopicSchema and NewContent. If these are only exported as types/interfaces,
// require() won't bring them in. For a script, we might have to redefine or use 'any'.

const contentDir = path.join(__dirname, '../content/topics');

interface JsonContentItem {
  id: string; 
  type: string;
  topic: string; 
  difficulty: string;
  tags: string[];
  question: {
    text: string;
    explanation?: string;
  };
  options?: any[];
  correct_answer: any;
  feedback?: {
    correct?: string;
    incorrect?: string;
  };
  [key: string]: any; 
}

// Using 'any' for schema types if proper import is difficult with require for types.
async function findOrCreateTopic(topicName: string): Promise<any> { 
  let topic = await getTopicByName(topicName);
  if (!topic) {
    console.log(`Creating topic: ${topicName}`);
    // createTopic expects an object matching NewTopic.
    // NewTopic is Omit<TopicSchema, ...> & { description?: string; category?: string; ... }
    // description and category are optional strings.
    topic = await createTopic({ name: topicName, description: undefined, category: undefined }); 
  }
  return topic;
}

async function processJsonFile(filePath: string): Promise<void> {
  console.log(`Processing file: ${filePath}`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const items: JsonContentItem[] | JsonContentItem = JSON.parse(fileContent);
    const itemsArray = Array.isArray(items) ? items : [items];

    for (const item of itemsArray) {
      const topicInstance = await findOrCreateTopic(item.topic);
      if (!topicInstance || topicInstance.id === undefined) {
        console.error(`Failed to find or create topic: ${item.topic} for item ${item.id}. Skipping content item.`);
        continue;
      }

      // createContent expects an object matching NewContent.
      // Using 'any' for contentData type for simplicity in script with CJS require.
      const contentData: any = { 
        topic_id: topicInstance.id,
        type: item.type,
        question_data: { 
          text: item.question.text, 
          explanation: item.question.explanation,
        }, 
        correct_answer: item.correct_answer,
        options: item.options,
        difficulty_level: item.difficulty,
        tags: item.tags,
      };

      console.log(`Creating content for topic '${item.topic}' (ID: ${topicInstance.id}): ${item.question.text.substring(0, 50)}...`);
      await createContent(contentData);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

async function getAllJsonFiles(dirPath: string): Promise<string[]> {
  let files: string[] = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getAllJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log('Starting content population script...');
  try {
    const jsonFiles = await getAllJsonFiles(contentDir);
    if (jsonFiles.length === 0) {
      console.log('No JSON files found in content/topics directory.');
      return;
    }

    for (const filePath of jsonFiles) {
      await processJsonFile(filePath);
    }

    console.log('Content population script finished successfully.');
  } catch (error) {
    console.error('Error during content population:', error);
  } finally {
    if (db && typeof db.destroy === 'function') {
      await db.destroy(); 
      console.log('Database connection closed.');
    }
  }
}

main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});

export {}; // Treat this file as a module for TypeScript's checker
