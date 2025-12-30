import { FaEye, FaEdit } from "react-icons/fa";

const students = [
  {
    name: "S P Deepika",
    dob: "Oct 20, 1991 (34 yrs)",
    gender: "Female",
    phone: "9789834715",
    status: "Active",
    createdAt: "Dec 16, 2025 02:49 PM",
  },
  {
    name: "Sabitha E",
    dob: "Jun 25, 1999 (26 yrs)",
    gender: "Female",
    phone: "7708924513",
    status: "Active",
    createdAt: "Dec 16, 2025 02:43 PM",
  },
];

export default function Students() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Details</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="p-4 font-semibold">{s.name}</td>
                <td>{s.dob}</td>
                <td>{s.gender}</td>
                <td>{s.phone}</td>
                <td>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                    {s.status}
                  </span>
                </td>
                <td>{s.createdAt}</td>
                <td className="flex gap-3 py-4">
                  <FaEye className="text-indigo-600 cursor-pointer" />
                  <FaEdit className="text-orange-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
