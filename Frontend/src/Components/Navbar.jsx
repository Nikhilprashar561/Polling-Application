import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dashboardPages = ["/dashboard", "/create-poll", "/user", "/poll-response", "/poll-results"];
  const isDashboard = dashboardPages.includes(location.pathname);

  const getPathName = () => {
    switch (location.pathname) {
      case "/":
        return "home";
      case "/login":
        return "login";
      case "/register":
        return "register";
      case "/dashboard":
        return "dashboard";
      case "/create-poll":
        return "create-poll";
      case "/poll-response":
        return "poll-response";
      case "/poll-results":
        return "poll-results";
      case "/user":
        return "user";
      default:
        return "home";
    }
  };

  const currentPage = getPathName();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl h-16 mx-auto px-6 flex items-center justify-between">
        <Logo onClick={() => navigate("/")} />

        {/* Desktop nav */}
        {!isDashboard && (
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "About"].map((item) => (
              <span
                key={item}
                className="relative text-sm text-gray-500 cursor-pointer transition-colors duration-200 hover:text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Dashboard nav */}
        {isDashboard && (
          <div className="hidden md:flex items-center gap-6">
            <span
              onClick={() => navigate("/dashboard")}
              className={`relative text-sm cursor-pointer transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full ${
                currentPage === "dashboard"
                  ? "font-semibold text-black after:w-full"
                  : "text-gray-500 hover:text-black after:w-0"
              }`}
            >
              Dashboard
            </span>

            <span
              onClick={() => navigate("/create-poll")}
              className={`relative text-sm cursor-pointer transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full ${
                currentPage === "create-poll"
                  ? "font-semibold text-black after:w-full"
                  : "text-gray-500 hover:text-black after:w-0"
              }`}
            >
              Create Poll
            </span>
          </div>
        )}

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!isDashboard ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-sm font-medium cursor-pointer rounded-full border border-gray-200 text-black transition-all duration-200 hover:border-black"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 text-sm font-medium cursor-pointer rounded-full bg-black text-white transition-all duration-200 hover:opacity-90"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/user")}
                className="w-9 h-9 flex items-center cursor-pointer justify-center rounded-full bg-black text-white text-sm font-semibold"
              >
                JD
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-5 flex flex-col gap-1">
            <span
              className={`block h-0.5 bg-black transition-all duration-300 ${
                menuOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            ></span>

            <span
              className={`block h-0.5 bg-black transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>

            <span
              className={`block h-0.5 bg-black transition-all duration-300 ${
                menuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 bg-white border-t border-gray-100">
          {!isDashboard &&
            ["Features", "Pricing", "About"].map((item) => (
              <span
                key={item}
                className="text-sm text-gray-600 cursor-pointer hover:text-black transition-colors duration-200"
              >
                {item}
              </span>
            ))}

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="w-full py-3 cursor-pointer text-sm font-medium rounded-full border border-gray-200 transition-all duration-200 hover:border-black"
            >
              Sign In
            </button>

            <button
              onClick={() => {
                navigate("/register");
                setMenuOpen(false);
              }}
              className="w-full py-3 cursor-pointer text-sm font-medium rounded-full bg-black text-white transition-all duration-200 hover:opacity-90"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
