// Simple database query to debug leaderboard data
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database/french_learning.db'
  },
  useNullAsDefault: true
});

async function debugLeaderboard() {
  try {
    console.log('=== DEBUGGING LEADERBOARD DATA ===');
    
    // Check if users table exists and has data
    console.log('\n1. Checking users table:');
    const users = await knex('users').select('id', 'firstName', 'lastName', 'email').limit(5);
    console.log(`Found ${users.length} users:`, users);
    
    // Check if userProgress table exists and has data
    console.log('\n2. Checking userProgress table:');
    const userProgress = await knex('userProgress').select('*').limit(5);
    console.log(`Found ${userProgress.length} userProgress records:`, userProgress);
    
    // Check the JOIN query that leaderboard uses
    console.log('\n3. Testing leaderboard JOIN query (no filters):');
    const joinTest = await knex('userProgress as up')
      .join('users as u', 'up.userId', 'u.id')
      .select('u.firstName', 'u.lastName', 'u.email', 'up.weeklyXp', 'up.totalXp', 'up.streakDays', 'up.currentLevel')
      .limit(5);
    console.log(`JOIN result count: ${joinTest.length}`, joinTest);
    
    // Check the actual leaderboard query with filters
    console.log('\n4. Testing actual leaderboard query (with weeklyXp > 0 filter):');
    const leaderboardQuery = await knex('userProgress as up')
      .join('users as u', 'up.userId', 'u.id')
      .select('u.firstName', 'u.lastName', 'u.email', 'up.weeklyXp', 'up.streakDays', 'up.currentLevel')
      .where('up.weeklyXp', '>', 0)
      .orderBy('up.weeklyXp', 'desc')
      .limit(10);
    console.log(`Filtered leaderboard count: ${leaderboardQuery.length}`, leaderboardQuery);
    
    console.log('\n=== DEBUG COMPLETE ===');
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await knex.destroy();
  }
}

debugLeaderboard();
