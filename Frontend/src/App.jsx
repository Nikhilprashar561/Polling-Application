import { useState } from "react";
import CreatePollPage from "./pages/CreatePollPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PollResponsePage from "./pages/PollResponsePage";
import PollResultsPage from "./pages/PollResultsPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onNavigate={setPage} />;

      case "login":
        return <LoginPage onNavigate={setPage} />;

      case "register":
        return <RegisterPage onNavigate={setPage} />;

      case "dashboard":
        return <DashboardPage onNavigate={setPage} />;

      case "create-poll":
        return <CreatePollPage onNavigate={setPage} />;

      case "poll-response":
        return <PollResponsePage onNavigate={setPage} />;

      case "poll-results":
        return <PollResultsPage onNavigate={setPage} />;

      case "user":
        return <UserPage onNavigate={setPage} />;

      default:
        return <HomePage onNavigate={setPage} />;
    }
  };

  const showFooter = ["home", "login", "register"].includes(page);

  return (
    <>

      <div className="noise min-h-screen bg-white text-black">
        {/* Navbar */}
        <Navbar onNavigate={setPage} page={page} />

        {/* Pages */}
        <div className="min-h-screen">
          {renderPage()}
        </div>

        {/* Footer */}
        {showFooter && <Footer />}

        {/* Floating Navigator */}
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-up">
          <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-black/90 px-4 py-2.5 shadow-2xl backdrop-blur-md">
            {[
              ["home", "Home"],
              ["login", "Login"],
              ["register", "Register"],
              ["dashboard", "Dashboard"],
              ["create-poll", "Create"],
              ["poll-response", "Respond"],
              ["poll-results", "Results"],
              ["user", "Profile"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`rounded-full border-0 px-3 py-1 text-xs transition-all duration-200 cursor-pointer ${
                  page === id
                    ? "bg-white text-black shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
                style={{
                  fontWeight: page === id ? 700 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
