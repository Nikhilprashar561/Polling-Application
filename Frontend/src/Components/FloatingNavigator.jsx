import { useNavigate, useLocation } from "react-router-dom";

const FloatingNavigator = ({ pageRoutes }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-up">
      <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-black/90 px-4 py-2.5 shadow-2xl backdrop-blur-md">
        {pageRoutes.map(({ id, label, path }) => (
          <button
            key={id}
            onClick={() => navigate(path)}
            className={`rounded-full border-0 px-3 py-1 text-xs transition-all duration-200 cursor-pointer ${
              location.pathname === path
                ? "bg-white text-black shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
            style={{
              fontWeight: location.pathname === path ? 700 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloatingNavigator;
