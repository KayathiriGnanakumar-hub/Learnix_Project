import db from './config/db.js';

// Check tables
db.query('SHOW TABLES LIKE "%internship%"', (err, tables) => {
  console.log('\n=== TABLES ===');
  console.log('Error:', err);
  console.log('Tables:', tables);

  if (!err) {
    // Check structure of internship_applications
    db.query('DESCRIBE internship_applications', (err2, columns) => {
      console.log('\n=== INTERNSHIP_APPLICATIONS COLUMNS ===');
      console.log('Error:', err2);
      console.log('Columns:', columns);

      // Count records
      db.query('SELECT COUNT(*) as count FROM internship_applications', (err3, result) => {
        console.log('\n=== RECORD COUNT ===');
        console.log('Error:', err3);
        console.log('Count:', result);

        // Get sample records
        db.query('SELECT * FROM internship_applications LIMIT 3', (err4, records) => {
          console.log('\n=== SAMPLE RECORDS ===');
          console.log('Error:', err4);
          console.log('Records:', JSON.stringify(records, null, 2));
          process.exit(0);
        });
      });
    });
  } else {
    process.exit(0);
  }
});
