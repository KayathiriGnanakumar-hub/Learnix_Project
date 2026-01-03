import { useEffect, useState } from "react";
import axios from "axios";

export default function Internships() {
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("learnix_token");

    axios
      .get("http://localhost:5001/api/enroll/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        let count = 0;

        for (const c of res.data) {
          const p = await axios.get(
            `http://localhost:5001/api/progress/${c.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (p.data.total > 0 && p.data.total === p.data.completed) {
            count++;
          }
        }

        setEligible(count >= 2);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Internships</h1>

      {eligible ? (
        <p className="text-green-600 font-semibold">
          🎉 You are eligible for internships
        </p>
      ) : (
        <p className="text-yellow-600">
          Complete at least 2 courses to become eligible
        </p>
      )}
    </div>
  );
}
