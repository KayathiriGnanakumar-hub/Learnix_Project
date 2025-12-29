import { useEffect, useState } from "react";

export default function Certificates() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const ref = collection(
        db,
        "users",
        user.uid,
        "enrolledCourses"
      );

      const snap = await getDocs(ref);
      const completed = snap.docs
        .map((d) => d.data())
        .filter((c) => c.completed === true);

      setCerts(completed);
    });

    return () => unsub();
  }, []);

  if (certs.length === 0) {
    return <p>No certificates earned yet.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Certificates
      </h1>

      {certs.map((c, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl shadow mb-4"
        >
          <h3 className="font-semibold">
            {c.title}
          </h3>
          <p className="text-sm text-gray-600">
            Certificate of Completion
          </p>
        </div>
      ))}
    </div>
  );
}
