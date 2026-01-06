import db from './config/db.js';

// Check video_progress table structure
db.query('DESCRIBE video_progress', (err, columns) => {
  console.log('\n=== VIDEO_PROGRESS TABLE COLUMNS ===');
  console.log('Error:', err);
  if (!err) {
    console.log('Columns:', columns.map(c => c.Field + ' (' + c.Type + ')').join(', '));
  }

  // Check quiz_results table structure
  db.query('DESCRIBE quiz_results', (err2, columns2) => {
    console.log('\n=== QUIZ_RESULTS TABLE COLUMNS ===');
    console.log('Error:', err2);
    if (!err2) {
      console.log('Columns:', columns2.map(c => c.Field + ' (' + c.Type + ')').join(', '));
    }

    // Check enrollments table structure
    db.query('DESCRIBE enrollments', (err3, columns3) => {
      console.log('\n=== ENROLLMENTS TABLE COLUMNS ===');
      console.log('Error:', err3);
      if (!err3) {
        console.log('Columns:', columns3.map(c => c.Field + ' (' + c.Type + ')').join(', '));
      }

      process.exit(0);
    });
  });
});
