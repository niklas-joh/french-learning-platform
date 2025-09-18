import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Adding weeklyXp column to userProgress table...');
  
  // Check if column already exists
  const hasWeeklyXp = await knex.schema.hasColumn('userProgress', 'weeklyXp');
  const hasResetDate = await knex.schema.hasColumn('userProgress', 'lastXpResetDate');
  
  if (!hasWeeklyXp || !hasResetDate) {
    await knex.schema.alterTable('userProgress', (table) => {
      if (!hasWeeklyXp) {
        table.integer('weeklyXp').notNullable().defaultTo(0);
      }
      if (!hasResetDate) {
        table.date('lastXpResetDate').nullable(); // Track when weekly XP was last reset
      }
    });
    
    // Initialize weeklyXp from totalXp for existing users (bootstrap data)
    const existingUsers = await knex('userProgress').where('totalXp', '>', 0);
    
    if (existingUsers.length > 0) {
      await knex.raw(`
        UPDATE userProgress 
        SET weeklyXp = CASE 
          WHEN totalXp > 500 THEN 500 
          ELSE totalXp 
        END,
        lastXpResetDate = DATE('now', '-7 days')
        WHERE weeklyXp = 0 AND totalXp > 0
      `);
    }
    
    console.log(`✅ weeklyXp column added and bootstrapped for ${existingUsers.length} users`);
  } else {
    console.log('⏭️ weeklyXp column already exists');
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('userProgress', (table) => {
    table.dropColumn('weeklyXp');
    table.dropColumn('lastXpResetDate');
  });
  console.log('weeklyXp and lastXpResetDate columns dropped');
}
