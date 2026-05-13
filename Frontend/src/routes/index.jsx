import CreatePollPage from "../pages/CreatePollPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import PollResponsePage from "../pages/PollResponsePage";
import PollResultsPage from "../pages/PollResultsPage";
import RegisterPage from "../pages/RegisterPage";
import UserPage from "../pages/UserPage";

export const routes = [
  {
    path: "/",
    element: <HomePage />,
    name: "Home",
    id: "home",
  },
  {
    path: "/login",
    element: <LoginPage />,
    name: "Login",
    id: "login",
  },
  {
    path: "/register",
    element: <RegisterPage />,
    name: "Register",
    id: "register",
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    name: "Dashboard",
    id: "dashboard",
  },
  {
    path: "/create-poll",
    element: <CreatePollPage />,
    name: "Create",
    id: "create-poll",
  },
  {
    path: "/poll-response",
    element: <PollResponsePage />,
    name: "Respond",
    id: "poll-response",
  },
  {
    path: "/poll-results",
    element: <PollResultsPage />,
    name: "Results",
    id: "poll-results",
  },
  {
    path: "/user",
    element: <UserPage />,
    name: "Profile",
    id: "user",
  },
];

export const getPageRoutes = () => {
  return [
    { id: "home", label: "Home", path: "/" },
    { id: "login", label: "Login", path: "/login" },
    { id: "register", label: "Register", path: "/register" },
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "create-poll", label: "Create", path: "/create-poll" },
    { id: "poll-response", label: "Respond", path: "/poll-response" },
    { id: "poll-results", label: "Results", path: "/poll-results" },
    { id: "user", label: "Profile", path: "/user" },
  ];
};
