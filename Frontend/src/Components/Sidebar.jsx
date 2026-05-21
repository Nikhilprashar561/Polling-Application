import { useNavigate, useLocation } from "react-router-dom";
import { usePoll } from "../context/pollContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { polls } = usePoll();

  const getPageIdFromPath = () => {
    switch (location.pathname) {
      case "/dashboard": return "dashboard";
      case "/create-poll": return "create-poll";
      case "/user": return "user";
      default: return "";
    }
  };

  const active = getPageIdFromPath();

  const items = [
    { id: "dashboard", icon: "▦", label: "Dashboard", path: "/dashboard" },
    { id: "create-poll", icon: "+", label: "Create Poll", path: "/create-poll" },
    { id: "user", icon: "◎", label: "Profile", path: "/user" },
  ];

  const activePolls = polls.filter((p) => p.status === "active").length;
  const totalPolls = polls.length;
  // Show polls used out of some limit (5 on free plan)
  const limit = 5;
  const used = Math.min(totalPolls, limit);
  const pct = Math.round((used / limit) * 100);

  return (
    <aside className="hidden min-h-screen w-56 shrink-0 flex-col border-r border-gray-100 bg-white px-3 pb-8 pt-6 md:flex">
      {/* Navigation */}
      <div className="mt-2 flex flex-col gap-1">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`nav-item animate-fade-up flex w-full items-center gap-3 rounded-xl border-0 px-4 py-3 text-left text-sm font-medium cursor-pointer ${
              active === item.id ? "active" : ""
            }`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <span className="w-5 text-center text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Plan Card */}
      <div className="mt-auto px-4 animate-fade-up anim-delay-3">
        <div className="rounded-xl border border-gray-100 p-3">
          <p className="mb-0.5 text-xs font-semibold text-black">Free Plan</p>
          <p className="mb-2 text-xs text-gray-400">
            {used} / {limit} polls used
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="progress-bar-inner h-full rounded-full bg-black"
              style={{ width: `${pct}%` }}
            />
          </div>
          <button className="btn-primary mt-3 w-full rounded-lg bg-black py-2 text-xs font-semibold text-white">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
