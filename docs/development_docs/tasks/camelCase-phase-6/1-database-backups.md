# Task CC6.1: Create Database Backups

- **Goal**: Safeguard existing data before running camelCase migrations.
- **Steps**:
  1. Locate the development database file (default `server/database/french_learning.db`).
  2. Use `sqlite3` to export a full copy: `sqlite3 path/to/french_learning.db ".backup backup_pre_camelcase.sqlite"`.
  3. Store the backup in a secure location outside the repository.
  4. Verify you can restore it with `sqlite3 backup_pre_camelcase.sqlite ".restore path/to/french_learning.db"`.
- **Deliverable**: Verified backup file ensuring the database can be restored if migration issues arise.
