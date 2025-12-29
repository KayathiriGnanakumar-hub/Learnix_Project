import { useNavigate } from "react-router-dom";

export default function StudentHeader() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("learnix_user"));
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header
      className="w-full flex items-center justify-between px-10"
      style={{
        height: "100px",
        background: "linear-gradient(90deg, #6D28D9, #4F46E5)",
      }}
    >
      {/* LEFT : LOGO WITH BORDER */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white
          border-2 border-purple-500 shadow-sm"
        >
          <img src="/logo.png" alt="Learnix" className="h-8" />
          <span className="text-xl font-bold text-purple-700">
            Learnix
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        <div
          className="w-12 h-12 rounded-full bg-white text-indigo-600
          font-bold flex items-center justify-center border-2 border-indigo-400"
        >
          {firstLetter}
        </div>

        <button
          onClick={logout}
          className="px-5 py-2 rounded-lg bg-white
          text-indigo-600 font-medium border-2 border-indigo-400
          hover:bg-indigo-50 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
