const Sidebar = ({ active, onNavigate }) => {
  const items = [
    { id: "dashboard", icon: "▦", label: "Dashboard" },
    { id: "create-poll", icon: "+", label: "Create Poll" },
    { id: "user", icon: "◎", label: "Profile" },
  ];

  return (
    <aside className="hidden min-h-screen w-56 shrink-0 flex-col border-r border-gray-100 bg-white px-3 pb-8 pt-6 md:flex">
      
      {/* Navigation */}
      <div className="mt-2 flex flex-col gap-1">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item animate-fade-up flex w-full items-center gap-3 rounded-xl border-0 px-4 py-3 text-left text-sm font-medium cursor-pointer ${
              active === item.id ? "active" : ""
            }`}
            style={{
              animationDelay: `${index * 0.08}s`,
            }}
          >
            <span className="w-5 text-center text-base">
              {item.icon}
            </span>

            {item.label}
          </button>
        ))}
      </div>

      {/* Plan Card */}
      <div className="mt-auto px-4 animate-fade-up anim-delay-3">
        <div className="rounded-xl border border-gray-100 p-3">
          
          <p className="mb-0.5 text-xs font-semibold text-black">
            Free Plan
          </p>

          <p className="mb-2 text-xs text-gray-400">
            3 / 5 polls used
          </p>

          {/* Progress */}
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="progress-bar-inner h-full rounded-full bg-black"
              style={{ width: "60%" }}
            ></div>
          </div>

          {/* Upgrade Button */}
          <button className="btn-primary mt-3 w-full rounded-lg bg-black py-2 text-xs font-semibold text-white">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
