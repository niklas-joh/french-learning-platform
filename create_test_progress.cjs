// Create test userProgress records for leaderboard testing
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database/french_learning.db'
  },
  useNullAsDefault: true
});

async function createTestProgress() {
  try {
    console.log('=== CREATING TEST PROGRESS DATA ===');
    
    // First check if userProgress records already exist
    const existing = await knex('userProgress').select('*');
    console.log('Current userProgress records:', existing.length);
    
    if (existing.length > 0) {
      console.log('UserProgress records already exist, skipping creation');
      return;
    }
    
    // Create progress records for both users with correct column names
    const progressData = [
      {
        userId: 1, // admin@example.com
        currentLevel: 'A2',
        currentXp: 50,
        totalXp: 450,
        weeklyXp: 120,
        streakDays: 5,
        lessonsCompleted: 8,
        wordsLearned: 125,
        timeSpentMinutes: 240,
        accuracyRate: 0.85,
        lastActivityDate: new Date().toISOString().split('T')[0],
        lastXpResetDate: new Date().toISOString().split('T')[0]
      },
      {
        userId: 2, // user@example.com  
        currentLevel: 'A1',
        currentXp: 30,
        totalXp: 280,
        weeklyXp: 95,
        streakDays: 3,
        lessonsCompleted: 5,
        wordsLearned: 78,
        timeSpentMinutes: 180,
        accuracyRate: 0.78,
        lastActivityDate: new Date().toISOString().split('T')[0],
        lastXpResetDate: new Date().toISOString().split('T')[0]
      }
    ];
    
    console.log('Inserting test progress data...');
    await knex('userProgress').insert(progressData);
    
    console.log('✅ Test progress data created successfully!');
    
    // Verify the data was inserted
    const verification = await knex('userProgress as up')
      .join('users as u', 'up.userId', 'u.id')
      .select('u.firstName', 'u.lastName', 'up.weeklyXp', 'up.totalXp', 'up.currentLevel')
      .orderBy('up.weeklyXp', 'desc');
    
    console.log('Verification - Leaderboard data:');
    verification.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.firstName} ${entry.lastName}: ${entry.weeklyXp} XP (Level ${entry.currentLevel})`);
    });
    
  } catch (error) {
    console.error('Error creating test progress:', error);
  } finally {
    await knex.destroy();
  }
}

createTestProgress();
