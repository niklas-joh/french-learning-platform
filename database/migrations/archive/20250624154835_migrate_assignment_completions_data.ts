import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Find all assignments that were marked as 'completed'
  const completedAssignments = await knex('user_content_assignments').where('status', 'completed');

  if (completedAssignments.length > 0) {
    const completionsToInsert = completedAssignments.map(assignment => ({
      user_id: assignment.user_id,
      content_id: assignment.content_id,
      completed_at: assignment.updated_at || assignment.assigned_at, // Use updated_at as completion time, fallback to assigned_at
      attempt_number: 1, // Default for migrated data
      score: null, // No score data in the old table
      explicit_assignment_id: assignment.id,
      created_at: assignment.updated_at || new Date(),
      updated_at: assignment.updated_at || new Date(),
    }));

    // Insert the completion records into the new table
    await knex('user_content_completions').insert(completionsToInsert);
  }
}

export async function down(knex: Knex): Promise<void> {
  // This migration is one-way. Reversing it would require deleting completions
  // that were linked to explicit assignments, which could be destructive.
  // A manual process would be safer if a rollback is truly needed.
  // For simplicity in this automated script, we will only log a message.
  console.log('Rolling back migrate_assignment_completions_data is not automatically supported. Manual data cleanup may be required.');
}
