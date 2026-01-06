import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

const sampleInternships = [
  {
    title: "Frontend Developer Intern",
    company: "Tech Innovations Inc.",
    description: "Join our frontend team to build responsive and interactive web applications using React and modern JavaScript.",
    requirements: "Knowledge of React, HTML, CSS, JavaScript. Understanding of responsive design.",
    location: "Remote",
    job_type: "Remote",
    stipend: 15000,
    duration_months: 3,
    deadline: "2026-02-28"
  },
  {
    title: "Backend Developer Intern",
    company: "Cloud Systems Ltd.",
    description: "Work on backend services and APIs. Experience with Node.js, databases, and RESTful API development.",
    requirements: "Node.js, Express, MySQL/MongoDB, API design knowledge.",
    location: "Bangalore",
    job_type: "Full-time",
    stipend: 18000,
    duration_months: 3,
    deadline: "2026-02-20"
  },
  {
    title: "Full Stack Development Intern",
    company: "StartUp Hub",
    description: "End-to-end development experience. Build complete applications from frontend to database.",
    requirements: "React, Node.js, MySQL, Git, Problem-solving skills.",
    location: "Hybrid",
    job_type: "Full-time",
    stipend: 20000,
    duration_months: 6,
    deadline: "2026-03-15"
  },
  {
    title: "Mobile App Developer Intern",
    company: "AppWorld Studios",
    description: "Develop mobile applications for iOS and Android platforms. Work with React Native or Flutter.",
    requirements: "React Native/Flutter, JavaScript, UI/UX understanding.",
    location: "Remote",
    job_type: "Remote",
    stipend: 16000,
    duration_months: 4,
    deadline: "2026-02-25"
  },
  {
    title: "Data Science Intern",
    company: "Analytics Pro",
    description: "Work with data analysis, machine learning models, and Python. Contribute to real-world projects.",
    requirements: "Python, Machine Learning, Data Analysis, SQL.",
    location: "Mumbai",
    job_type: "Full-time",
    stipend: 17000,
    duration_months: 3,
    deadline: "2026-02-18"
  },
  {
    title: "UI/UX Designer Intern",
    company: "Design Studios",
    description: "Design user interfaces and experiences. Work with Figma and other design tools.",
    requirements: "Figma, UI/UX principles, Design thinking, Communication skills.",
    location: "Remote",
    job_type: "Remote",
    stipend: 14000,
    duration_months: 3,
    deadline: "2026-03-01"
  }
];

db.query("DELETE FROM internships", (err) => {
  if (err) {
    console.error("❌ Error clearing internships:", err);
    db.end();
    process.exit(1);
  }

  console.log("✅ Cleared existing internships");

  let inserted = 0;
  let failed = 0;

  sampleInternships.forEach((internship) => {
    const sql = `
      INSERT INTO internships
      (title, company, description, requirements, location, job_type, stipend, duration_months, deadline, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
    `;

    db.query(
      sql,
      [
        internship.title,
        internship.company,
        internship.description,
        internship.requirements,
        internship.location,
        internship.job_type,
        internship.stipend,
        internship.duration_months,
        internship.deadline
      ],
      (err) => {
        if (err) {
          console.error(`❌ Error inserting internship "${internship.title}":`, err);
          failed++;
        } else {
          inserted++;
          console.log(`✅ Inserted: ${internship.title}`);
        }

        if (inserted + failed === sampleInternships.length) {
          console.log("\n📊 Seeding Complete!");
          console.log(`   Inserted: ${inserted}`);
          if (failed > 0) console.log(`   Failed: ${failed}`);

          db.query(
            "SELECT COUNT(*) as count FROM internships",
            (err, results) => {
              if (!err) {
                console.log(`   Total internships: ${results[0].count}`);
              }

              db.end();
              process.exit(0);
            }
          );
        }
      }
    );
  });
});
