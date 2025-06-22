import knex from 'knex';
import fs from 'fs/promises';
import path from 'path';
// Import the Knex configuration from the server project.  Older versions of
// this script referenced `../server/knexfile`, but the actual file lives under
// `server/src`.
import knexConfig from '../server/src/knexfile';

// Initialize Knex with the development configuration
const db = knex(knexConfig.development);

const contentRoot = path.join(__dirname, '../content/topics');

async function populateContent() {
  try {
    console.log('Starting content population script...');

    // 1. Read all topic directories
    const topicDirs = await fs.readdir(contentRoot, { withFileTypes: true });

    for (const topicDir of topicDirs) {
      if (topicDir.isDirectory()) {
        const topicName = topicDir.name;
        console.log(`Processing topic: ${topicName}`);

        // Check if topic exists, otherwise insert it
        let [topic] = await db('topics').where({ name: topicName });
        if (!topic) {
          [topic] = await db('topics').insert({ name: topicName }).returning('*');
          console.log(`Inserted new topic: ${topic.name} (ID: ${topic.id})`);
        } else {
          console.log(`Topic "${topic.name}" already exists (ID: ${topic.id}).`);
        }

        // 2. Read all content files for the topic
        const contentFilesPath = path.join(contentRoot, topicName);
        const contentFiles = await fs.readdir(contentFilesPath);

        for (const contentFile of contentFiles) {
          if (path.extname(contentFile) === '.json') {
            const filePath = path.join(contentFilesPath, contentFile);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const contentItems = JSON.parse(fileContent); // It's an array of items

            for (const item of contentItems) {
              const questionText = item.question.text;

              // Check for existence using the question text inside the JSON blob
              const existingContent = await db('content')
                .where({ topic_id: topic.id })
                .andWhereRaw(`json_extract(question_data, '$.text') = ?`, [questionText])
                .first();

              if (!existingContent) {
                // Combine question and feedback into the question_data blob
                const questionData = {
                  ...item.question,
                  feedback: item.feedback,
                };

                await db('content').insert({
                  topic_id: topic.id,
                  type: item.type,
                  question_data: JSON.stringify(questionData),
                  correct_answer: JSON.stringify(item.correct_answer),
                  options: JSON.stringify(item.options),
                  difficulty_level: item.difficulty,
                  tags: JSON.stringify(item.tags),
                  active: true,
                });
                console.log(`  - Inserted content: ${questionText}`);
              } else {
                console.log(`  - Content "${questionText}" already exists for this topic.`);
              }
            }
          }
        }
      }
    }

    console.log('Content population script finished successfully.');
  } catch (error) {
    console.error('Error populating content:', error);
  } finally {
    // 3. Close the database connection
    await db.destroy();
    console.log('Database connection closed.');
  }
}

populateContent();
