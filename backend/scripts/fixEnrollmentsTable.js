import mysql from 'mysql2';

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Gnana@1972',
  database: 'learnix_db'
});

conn.connect((err) => {
  if (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');

  // First, check existing columns
  conn.query('DESCRIBE enrollments', (err, columns) => {
    if (err) {
      console.error('❌ Check error:', err.message);
      conn.end();
      process.exit(1);
    }

    const columnNames = columns.map(c => c.Field);
    console.log('\n📋 Existing columns:', columnNames);

    const steps = [];
    
    steps.push("ALTER TABLE enrollments MODIFY COLUMN status VARCHAR(50) DEFAULT 'in_progress'");
    steps.push("ALTER TABLE enrollments MODIFY COLUMN progress INT DEFAULT 0");
    
    if (!columnNames.includes('completed_at')) {
      steps.push("ALTER TABLE enrollments ADD COLUMN completed_at TIMESTAMP NULL");
    }

    let step = 0;
    const executeNext = () => {
      if (step >= steps.length) {
        console.log('\n✅ All migration steps completed!');
        
        // Final verification
        conn.query('DESCRIBE enrollments', (err, results) => {
          if (err) {
            console.error('❌ Verify error:', err.message);
          } else {
            console.log('\n📋 Final enrollments table structure:');
            console.table(results.map(r => ({
              Field: r.Field,
              Type: r.Type,
              Null: r.Null,
              Default: r.Default || 'NULL'
            })));
          }
          conn.end();
          process.exit(0);
        });
        return;
      }

      const sql = steps[step];
      console.log(`\n⏳ Step ${step + 1}/${steps.length}: ${sql.substring(0, 70)}...`);
      
      conn.query(sql, (err) => {
        if (err) {
          console.error(`❌ Step ${step + 1} error:`, err.message);
          conn.end();
          process.exit(1);
        }
        console.log(`✅ Step ${step + 1} completed`);
        step++;
        executeNext();
      });
    };

    executeNext();
  });
});
