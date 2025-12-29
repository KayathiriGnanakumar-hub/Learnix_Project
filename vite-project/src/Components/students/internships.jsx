import { useEffect, useState } from "react";

export default function Internships() {
  const [eligible, setEligible] = useState(false);

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
      const completed = snap.docs.filter(
        (d) => d.data().completed === true
      );

      setEligible(completed.length >= 2);
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Internship Eligibility
      </h1>

      {eligible ? (
        <p className="text-green-600 font-semibold">
          🎉 You are eligible for internships!
        </p>
      ) : (
        <p className="text-yellow-600">
          Complete more courses to become eligible.
        </p>
      )}
    </div>
  );
}
