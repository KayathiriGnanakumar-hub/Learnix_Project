import { useEffect, useState } from "react";
import axios from "axios";

export default function Certificates() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("learnix_token");

    axios
      .get("http://localhost:5001/api/enroll/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const done = [];

        for (const c of res.data) {
          const p = await axios.get(
            `http://localhost:5001/api/progress/${c.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (p.data.total > 0 && p.data.total === p.data.completed) {
            done.push(c);
          }
        }

        setCompleted(done);
      });
  }, []);

  if (completed.length === 0) {
    return <p>No certificates earned yet.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Certificates
      </h1>

      {completed.map((c) => (
        <div key={c.id} className="bg-white p-4 rounded-xl shadow mb-4">
          <h3 className="font-semibold">{c.title}</h3>
          <p className="text-sm text-gray-500">
            Certificate of Completion
          </p>
        </div>
      ))}
    </div>
  );
}
