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
      className="w-full flex items-center justify-between px-6
      border-b-2 border-white"
      style={{
        height: "70px",
        background: "linear-gradient(90deg, #4F46E5, #7C3AED)", // indigo → purple
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white">
          <img src="/logo.png" alt="Learnix" className="h-6" />
          <span className="text-lg font-bold text-purple-700">
            Learnix
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-white text-purple-700
          font-bold flex items-center justify-center">
          {firstLetter}
        </div>

        <button
          onClick={logout}
          className="px-4 py-1.5 rounded-md bg-white
          text-purple-700 text-sm font-medium hover:bg-purple-100 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
